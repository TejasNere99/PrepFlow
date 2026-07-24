import { ResourceProgress } from '../models/ResourceProgress.js';
import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
import { Subject } from '../models/Subject.js';
import { Sheet } from '../models/Sheet.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export const upsertProgress = async (userId, resourceId, updateData) => {
  const { completed } = updateData;
  const completedAt = completed ? new Date() : null;
  const lastAccessedAt = new Date();

  const progress = await ResourceProgress.findOneAndUpdate(
    { userId, resourceId },
    { 
      ...updateData,
      ...(completed !== undefined && { completedAt }),
      lastAccessedAt 
    },
    { new: true, upsert: true }
  );

  return progress;
};

export const getSheetProgress = async (userId, sheetId) => {
  const subjects = await Subject.find({ sheetId, status: CONTENT_STATUS.ACTIVE }).lean();
  const subjectIds = subjects.map(s => s._id);

  const chapters = await Chapter.find({ subjectId: { $in: subjectIds }, status: CONTENT_STATUS.ACTIVE }).lean();
  const chapterIds = chapters.map(c => c._id);

  const resources = await Resource.find({ chapterId: { $in: chapterIds }, status: CONTENT_STATUS.ACTIVE }).lean();
  const resourceIds = resources.map(r => r._id);

  const progressRecords = await ResourceProgress.find({ 
    userId, 
    resourceId: { $in: resourceIds },
    completed: true
  }).lean();

  const completedResourceIds = new Set(progressRecords.map(p => p.resourceId.toString()));

  const chapterProgress = {};
  const subjectProgress = {};

  chapters.forEach(c => {
    chapterProgress[c._id.toString()] = { completed: 0, total: 0 };
  });
  subjects.forEach(s => {
    subjectProgress[s._id.toString()] = { completed: 0, total: 0 };
  });

  resources.forEach(r => {
    const chapId = r.chapterId.toString();
    const chap = chapters.find(c => c._id.toString() === chapId);
    if (!chap) return;
    const subId = chap.subjectId.toString();

    const isCompleted = completedResourceIds.has(r._id.toString());

    if (chapterProgress[chapId]) chapterProgress[chapId].total += 1;
    if (subjectProgress[subId]) subjectProgress[subId].total += 1;
    
    if (isCompleted) {
      if (chapterProgress[chapId]) chapterProgress[chapId].completed += 1;
      if (subjectProgress[subId]) subjectProgress[subId].completed += 1;
    }
  });

  for (const key in chapterProgress) {
    const p = chapterProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
  }
  for (const key in subjectProgress) {
    const p = subjectProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
  }

  const sheetTotal = resources.length;
  const sheetCompleted = completedResourceIds.size;
  const sheetPercentage = sheetTotal > 0 ? Math.round((sheetCompleted / sheetTotal) * 100) : 0;

  return {
    sheetProgress: { completed: sheetCompleted, total: sheetTotal, percentage: sheetPercentage },
    subjectProgress,
    chapterProgress,
    completedResources: Array.from(completedResourceIds)
  };
};

export const getProgressSummary = async (userId) => {
  const lastAccessedProgress = await ResourceProgress.findOne({ userId })
    .sort({ lastAccessedAt: -1 })
    .populate({
      path: 'resourceId',
      populate: {
        path: 'chapterId',
        populate: {
          path: 'subjectId',
          populate: {
            path: 'sheetId'
          }
        }
      }
    });

  let continueLearning = null;
  if (lastAccessedProgress && lastAccessedProgress.resourceId) {
    const resource = lastAccessedProgress.resourceId;
    const chapter = resource.chapterId;
    const subject = chapter?.subjectId;
    const sheet = subject?.sheetId;
    if (sheet) {
      continueLearning = {
        sheet: { id: sheet._id, title: sheet.title, slug: sheet.slug },
        chapter: { id: chapter._id, title: chapter.title },
        resource: { id: resource._id, title: resource.title }
      };
    }
  }

  const allSheets = await Sheet.find({ status: CONTENT_STATUS.ACTIVE }).lean();
  const allSubjects = await Subject.find({ sheetId: { $in: allSheets.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();
  const allChapters = await Chapter.find({ subjectId: { $in: allSubjects.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();
  const allResources = await Resource.find({ chapterId: { $in: allChapters.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();

  const allProgress = await ResourceProgress.find({ userId, completed: true }).lean();
  
  const sheetProgress = {};
  allSheets.forEach(s => {
    sheetProgress[s._id.toString()] = { id: s._id, title: s.title, slug: s.slug, completed: 0, total: 0 };
  });

  allResources.forEach(r => {
    const chap = allChapters.find(c => c._id.toString() === r.chapterId.toString());
    if (!chap) return;
    const sub = allSubjects.find(s => s._id.toString() === chap.subjectId.toString());
    if (!sub) return;
    const sheetId = sub.sheetId.toString();

    if (sheetProgress[sheetId]) {
      sheetProgress[sheetId].total += 1;
      const isCompleted = allProgress.some(p => p.resourceId.toString() === r._id.toString());
      if (isCompleted) {
        sheetProgress[sheetId].completed += 1;
      }
    }
  });

  let overallTotal = 0;
  let overallCompleted = 0;

  for (const key in sheetProgress) {
    const p = sheetProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    overallTotal += p.total;
    overallCompleted += p.completed;
  }

  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return {
    continueLearning,
    overallProgress: {
      completed: overallCompleted,
      total: overallTotal,
      percentage: overallPercentage
    },
    sheetsProgress: Object.values(sheetProgress),
    completedResources: allProgress.map(p => p.resourceId)
  };
};
