import { Sheet } from '../models/Sheet.js';
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

// Helper to generate a unique slug by appending counters
const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title) || 'sheet';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Sheet.countDocuments(query);
    if (count === 0) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
};

export const createSheet = async (data, userId) => {
  const { title, description, status, order, tags, metadata } = data;

  const slug = await generateUniqueSlug(title);

  const sheet = new Sheet({
    title,
    description,
    slug,
    status: status || CONTENT_STATUS.DRAFT,
    order: order !== undefined ? order : 0,
    tags: tags || [],
    metadata: metadata || {},
    createdBy: userId,
    updatedBy: userId,
  });

  return await sheet.save();
};

export const getSheets = async ({ page = 1, limit = 10, search, status, sort }) => {
  const query = {};

  // Text search on title
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filter by status
  if (status) {
    if (status === 'all') {
      // Exclude ARCHIVED by default for 'all' in admin view,
      // as archived represents soft deleted items.
      query.status = { $ne: CONTENT_STATUS.ARCHIVED };
    } else {
      query.status = status;
    }
  } else {
    // Default: exclude ARCHIVED sheets
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

  const total = await Sheet.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  const sheets = await Sheet.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return {
    sheets,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

export const getSheetById = async (id) => {
  const sheet = await Sheet.findById(id);
  if (!sheet) {
    throw new ApiError(404, 'Sheet not found');
  }
  return sheet;
};

export const updateSheet = async (id, data, userId) => {
  const sheet = await Sheet.findById(id);
  if (!sheet) {
    throw new ApiError(404, 'Sheet not found');
  }

  const { title, description, status, order, tags, metadata } = data;

  if (title !== undefined && title !== sheet.title) {
    sheet.title = title;
    sheet.slug = await generateUniqueSlug(title, id);
  }

  if (description !== undefined) sheet.description = description;
  if (status !== undefined) sheet.status = status;
  if (order !== undefined) sheet.order = order;
  if (tags !== undefined) sheet.tags = tags;
  if (metadata !== undefined) sheet.metadata = metadata;
  
  sheet.updatedBy = userId;

  return await sheet.save();
};

export const archiveSheet = async (id, userId) => {
  const sheet = await Sheet.findById(id);
  if (!sheet) {
    throw new ApiError(404, 'Sheet not found');
  }

  sheet.status = CONTENT_STATUS.ARCHIVED;
  sheet.updatedBy = userId;

  return await sheet.save();
};

export const getSheetBySlug = async (slug) => {
  const sheet = await Sheet.findOne({ slug });
  if (!sheet) {
    throw new ApiError(404, 'Sheet not found');
  }
  return sheet;
};
