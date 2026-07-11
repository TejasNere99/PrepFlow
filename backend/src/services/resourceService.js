import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
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

// Helper to generate a unique slug scoped by chapterId
const generateUniqueSlug = async (title, chapterId, excludeId = null) => {
  const baseSlug = slugify(title) || 'resource';
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug, chapterId };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Resource.countDocuments(query);
    if (count === 0) {
      exists = false;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
};

export const createResource = async (data) => {
  const { chapterId, title, resourceType, url, storageUrl, description, status, order, tags, metadata } = data;

  // Validate that the chapter exists and is ACTIVE
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }
  
  if (chapter.status !== CONTENT_STATUS.ACTIVE) {
    throw new ApiError(400, 'Resources can only be created inside ACTIVE chapters');
  }

  const slug = await generateUniqueSlug(title, chapterId);

  // Automatic Display Order assignment if order is not provided
  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === '') {
    const maxOrderResource = await Resource.findOne({ chapterId })
      .sort('-order')
      .select('order');
    finalOrder = maxOrderResource ? (maxOrderResource.order || 0) + 1 : 1;
  } else {
    finalOrder = Number(order);
  }

  const resource = new Resource({
    chapterId,
    title,
    resourceType,
    url: url || '',
    storageUrl: storageUrl || '',
    description,
    slug,
    status: status || CONTENT_STATUS.DRAFT,
    order: finalOrder,
    tags: tags || [],
    metadata: metadata || {},
  });

  return await resource.save();
};

export const getResources = async ({ page = 1, limit = 10, search, status, chapterId, resourceType, sort }) => {
  const query = {};

  if (chapterId) {
    query.chapterId = chapterId;
  }

  if (resourceType) {
    query.resourceType = resourceType;
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
    // Default: exclude ARCHIVED resources
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

  const total = await Resource.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  const resources = await Resource.find(query)
    .populate({
      path: 'chapterId',
      select: 'title slug subjectId status',
      populate: {
        path: 'subjectId',
        select: 'title slug sheetId',
        populate: {
          path: 'sheetId',
          select: 'title slug'
        }
      }
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return {
    resources,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

export const getResourceById = async (id) => {
  const resource = await Resource.findById(id).populate({
    path: 'chapterId',
    select: 'title slug subjectId',
    populate: {
      path: 'subjectId',
      select: 'title slug sheetId',
      populate: {
        path: 'sheetId',
        select: 'title slug'
      }
    }
  });
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }
  return resource;
};

export const updateResource = async (id, data) => {
  const resource = await Resource.findById(id);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  const { chapterId, title, resourceType, url, storageUrl, description, status, order, tags, metadata } = data;

  let newChapterId = chapterId !== undefined ? chapterId : resource.chapterId;

  // Validate chapter if it is changing
  if (chapterId !== undefined && chapterId !== resource.chapterId.toString()) {
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new ApiError(404, 'Chapter not found');
    }
    if (chapter.status !== CONTENT_STATUS.ACTIVE) {
       throw new ApiError(400, 'Cannot move resource to a non-ACTIVE chapter');
    }
  }

  if (title !== undefined || chapterId !== undefined) {
    const checkTitle = title !== undefined ? title : resource.title;
    // Only re-generate slug if title or chapterId changes
    if (title !== resource.title || chapterId !== resource.chapterId?.toString()) {
      resource.slug = await generateUniqueSlug(checkTitle, newChapterId, id);
    }
  }

  // Ensure we don't end up with zero URLs if both are wiped
  const finalUrl = url !== undefined ? url : resource.url;
  const finalStorageUrl = storageUrl !== undefined ? storageUrl : resource.storageUrl;
  if (!finalUrl.trim() && !finalStorageUrl.trim()) {
    throw new ApiError(400, 'Resource must have at least one valid URL');
  }

  if (title !== undefined) resource.title = title;
  if (chapterId !== undefined) resource.chapterId = chapterId;
  if (resourceType !== undefined) resource.resourceType = resourceType;
  if (url !== undefined) resource.url = url;
  if (storageUrl !== undefined) resource.storageUrl = storageUrl;
  if (description !== undefined) resource.description = description;
  if (status !== undefined) resource.status = status;
  
  if (order !== undefined && order !== '') {
    resource.order = Number(order);
  }

  if (tags !== undefined) resource.tags = tags;
  if (metadata !== undefined) resource.metadata = metadata;
  
  return await resource.save();
};

export const archiveResource = async (id) => {
  const resource = await Resource.findById(id);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  resource.status = CONTENT_STATUS.ARCHIVED;

  return await resource.save();
};
