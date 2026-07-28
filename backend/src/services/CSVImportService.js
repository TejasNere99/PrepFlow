import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { ENTITY_TYPES } from '../constants/adminActions.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';
import slugify from 'slugify';

class CSVImportService {
  static _getModel(entityType) {
    switch (entityType) {
      case ENTITY_TYPES.SUBJECT: return Subject;
      case ENTITY_TYPES.CHAPTER: return Chapter;
      case ENTITY_TYPES.RESOURCE: return Resource;
      default: throw new ApiError(400, 'Invalid entity type for import');
    }
  }

  /**
   * Validates a batch of CSV rows.
   * Returns a detailed preview with validation errors and duplicate conflicts.
   * @param {string} entityType 
   * @param {Array<Object>} rows 
   * @param {string} parentId 
   */
  static async validateImport(entityType, rows, parentId) {
    if (!Array.isArray(rows) || rows.length === 0) throw new ApiError(400, 'Import rows are empty');

    const Model = this._getModel(entityType);
    const parentField = entityType === ENTITY_TYPES.SUBJECT ? 'sheetId' :
                        entityType === ENTITY_TYPES.CHAPTER ? 'subjectId' : 'chapterId';

    // Fetch existing titles under the same parent to detect duplicates
    const existingDocs = await Model.find({ [parentField]: parentId }).select('title').lean();
    const existingTitles = new Set(existingDocs.map(d => d.title.toLowerCase().trim()));

    const validatedRows = rows.map((row, index) => {
      const title = row.title ? row.title.trim() : '';
      const errors = [];
      let isDuplicate = false;

      if (!title) {
        errors.push('Title is required');
      }

      if (title && existingTitles.has(title.toLowerCase())) {
        isDuplicate = true;
      }

      // Add resource specific validations
      if (entityType === ENTITY_TYPES.RESOURCE) {
        if (!row.resourceType) errors.push('Resource type is required');
        if (!row.url && !row.storageUrl) errors.push('URL or Storage URL is required');
      }

      return {
        _raw: row,
        index,
        title,
        isValid: errors.length === 0,
        errors,
        isDuplicate,
        action: isDuplicate ? 'Skip' : 'Import' // Default conflict resolution strategy
      };
    });

    return {
      totalRows: rows.length,
      validRows: validatedRows.filter(r => r.isValid && !r.isDuplicate).length,
      duplicateRows: validatedRows.filter(r => r.isDuplicate).length,
      errorRows: validatedRows.filter(r => !r.isValid).length,
      preview: validatedRows
    };
  }

  /**
   * Finalizes the import process after conflict resolution
   * @param {string} entityType 
   * @param {Array<Object>} validatedRows - Rows containing conflict resolution choices (Skip, Replace, Duplicate)
   * @param {string} parentId 
   */
  static async executeImport(entityType, validatedRows, parentId) {
    const Model = this._getModel(entityType);
    const parentField = entityType === ENTITY_TYPES.SUBJECT ? 'sheetId' :
                        entityType === ENTITY_TYPES.CHAPTER ? 'subjectId' : 'chapterId';

    const bulkOps = [];
    let imported = 0;
    let skipped = 0;
    let replaced = 0;

    for (const row of validatedRows) {
      if (!row.isValid) {
        skipped++;
        continue;
      }

      const slugBase = slugify(row.title, { lower: true, strict: true });
      const slug = `${slugBase}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const documentData = {
        title: row.title,
        slug,
        [parentField]: parentId,
        description: row._raw.description || '',
        status: row._raw.status || 'DRAFT',
      };

      if (entityType === ENTITY_TYPES.RESOURCE) {
        documentData.resourceType = row._raw.resourceType;
        documentData.url = row._raw.url || '';
        documentData.storageUrl = row._raw.storageUrl || '';
      }

      if (row.isDuplicate) {
        if (row.action === 'Skip') {
          skipped++;
          continue;
        } else if (row.action === 'Replace') {
          bulkOps.push({
            updateOne: {
              filter: { [parentField]: parentId, title: row.title },
              update: { $set: documentData }
            }
          });
          replaced++;
        } else if (row.action === 'Duplicate') {
          bulkOps.push({
            insertOne: {
              document: documentData
            }
          });
          imported++;
        }
      } else {
        bulkOps.push({
          insertOne: {
            document: documentData
          }
        });
        imported++;
      }
    }

    if (bulkOps.length > 0) {
      await Model.bulkWrite(bulkOps);
    }

    return {
      success: true,
      summary: {
        totalProcessed: validatedRows.length,
        imported,
        replaced,
        skipped
      }
    };
  }
}

export default CSVImportService;
