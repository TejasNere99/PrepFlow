import { Chapter } from '../models/Chapter.js';
import { Subject } from '../models/Subject.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { ApiError } from '../utils/ApiError.js';

// Helper to generate a URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Helper to generate a unique slug scoped by subjectId
const generateUniqueSlug = async (title, subjectId, excludeId = null) => {
  const baseSlug = slugify(title) || 'chapter';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Chapter.countDocuments(query);
    if (count === 0) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
};

export const createChapter = async (data) => {
  const { subjectId, title, description, status, order, tags, metadata } = data;

  // Validate that the subject exists and is ACTIVE
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }
  
  if (subject.status !== CONTENT_STATUS.ACTIVE) {
    throw new ApiError(400, 'Chapters can only be created inside ACTIVE subjects');
  }

  const slug = await generateUniqueSlug(title, subjectId);

  // Automatic Display Order assignment if order is not provided
  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === '') {
    const maxOrderChapter = await Chapter.findOne({ subjectId })
      .sort('-order')
      .select('order');
    finalOrder = maxOrderChapter ? (maxOrderChapter.order || 0) + 1 : 1;
  } else {
    finalOrder = Number(order);
  }

  const chapter = new Chapter({
    subjectId,
    title,
    description,
    slug,
    status: status || CONTENT_STATUS.DRAFT,
    order: finalOrder,
    tags: tags || [],
    metadata: metadata || {},
  });

  return await chapter.save();
};

export const getChapters = async ({ page = 1, limit = 10, search, status, subjectId, sort }) => {
  const query = {};

  if (subjectId) {
    query.subjectId = subjectId;
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
    // Default: exclude ARCHIVED chapters
    query.status = { $ne: CONTENT_STATUS.ARCHIVED };
  }

  // Sorting
  let sortOption = { displayOrder: 1 };
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

  const total = await Chapter.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  const chapters = await Chapter.find(query)
    .populate({
      path: 'subjectId',
      select: 'title slug sheetId status',
      populate: {
        path: 'sheetId',
        select: 'title slug'
      }
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return {
    chapters,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

export const getChapterById = async (id) => {
  const chapter = await Chapter.findById(id).populate({
    path: 'subjectId',
    select: 'title slug sheetId',
    populate: {
      path: 'sheetId',
      select: 'title slug'
    }
  });
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }
  return chapter;
};

export const updateChapter = async (id, data) => {
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }

  const { subjectId, title, description, status, order, tags, metadata } = data;

  let newSubjectId = subjectId !== undefined ? subjectId : chapter.subjectId;

  // Validate subject if it is changing
  if (subjectId !== undefined && subjectId !== chapter.subjectId.toString()) {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }
    // We allow moving to ACTIVE subjects, but not ARCHIVED
    if (subject.status === CONTENT_STATUS.ARCHIVED) {
       throw new ApiError(400, 'Cannot move chapter to an ARCHIVED subject');
    }
  }

  if (title !== undefined || subjectId !== undefined) {
    const checkTitle = title !== undefined ? title : chapter.title;
    // Only re-generate slug if title or subjectId changes
    if (title !== chapter.title || subjectId !== chapter.subjectId?.toString()) {
      chapter.slug = await generateUniqueSlug(checkTitle, newSubjectId, id);
    }
  }

  if (title !== undefined) chapter.title = title;
  if (subjectId !== undefined) chapter.subjectId = subjectId;
  if (description !== undefined) chapter.description = description;
  if (status !== undefined) chapter.status = status;
  
  if (order !== undefined && order !== '') {
    chapter.order = Number(order);
  }

  if (tags !== undefined) chapter.tags = tags;
  if (metadata !== undefined) chapter.metadata = metadata;
  
  return await chapter.save();
};

export const archiveChapter = async (id) => {
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }

  // TODO: Future Extension - Resource Management
  // When Resource Management is implemented, a Chapter containing Resources must not be archived.
  
  chapter.status = CONTENT_STATUS.ARCHIVED;

  return await chapter.save();
};
