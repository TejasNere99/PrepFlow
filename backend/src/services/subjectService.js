import { Subject } from '../models/Subject.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { ApiError } from '../utils/ApiError.js';

// Helper to generate a URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Helper to generate a unique slug scoped by sheetId
const generateUniqueSlug = async (title, sheetId, excludeId = null) => {
  const baseSlug = slugify(title) || 'subject';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Subject.countDocuments(query);
    if (count === 0) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
};

export const createSubject = async (data) => {
  const { sheetId, title, description, status, order, tags, metadata } = data;

  const slug = await generateUniqueSlug(title, sheetId);

  const subject = new Subject({
    sheetId,
    title,
    description,
    slug,
    status: status || CONTENT_STATUS.DRAFT,
    order: order !== undefined ? order : 0,
    tags: tags || [],
    metadata: metadata || {},
  });

  return await subject.save();
};

export const getSubjects = async ({ page = 1, limit = 10, search, status, sheetId, sort }) => {
  const query = {};

  if (sheetId) {
    query.sheetId = sheetId;
  }

  // Text search on title
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filter by status
  if (status) {
    if (status === 'all') {
      query.status = { $ne: CONTENT_STATUS.ARCHIVED };
    } else {
      query.status = status;
    }
  } else {
    // Default: exclude ARCHIVED subjects
    query.status = { $ne: CONTENT_STATUS.ARCHIVED };
  }

  // Sorting
  let sortOption = { order: 1 };
  if (sort) {
    if (sort.startsWith('-')) {
      sortOption = { [sort.substring(1)]: -1 };
    } else {
      sortOption = { [sort]: 1 };
    }
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await Subject.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  const subjects = await Subject.find(query)
    .populate('sheetId', 'title slug')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return {
    subjects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

export const getSubjectById = async (id) => {
  const subject = await Subject.findById(id).populate('sheetId', 'title slug');
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }
  return subject;
};

export const updateSubject = async (id, data) => {
  const subject = await Subject.findById(id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  const { sheetId, title, description, status, order, tags, metadata } = data;

  let newSheetId = sheetId !== undefined ? sheetId : subject.sheetId;

  if (title !== undefined || sheetId !== undefined) {
    const checkTitle = title !== undefined ? title : subject.title;
    // Only re-generate slug if title or sheetId changes
    if (title !== subject.title || sheetId !== subject.sheetId?.toString()) {
      subject.slug = await generateUniqueSlug(checkTitle, newSheetId, id);
    }
  }

  if (title !== undefined) subject.title = title;
  if (sheetId !== undefined) subject.sheetId = sheetId;
  if (description !== undefined) subject.description = description;
  if (status !== undefined) subject.status = status;
  if (order !== undefined) subject.order = order;
  if (tags !== undefined) subject.tags = tags;
  if (metadata !== undefined) subject.metadata = metadata;
  
  return await subject.save();
};

export const archiveSubject = async (id) => {
  const subject = await Subject.findById(id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  // TODO: Future hierarchy protection. When Chapter Management is implemented,
  // a Subject containing Chapters must not be archived.
  
  subject.status = CONTENT_STATUS.ARCHIVED;

  return await subject.save();
};
