import { ResourceProgress } from '../models/ResourceProgress.js';
import { UserResourcePreference } from '../models/UserResourcePreference.js';
import { Note } from '../models/Note.js';
import { RevisionSchedule, REVISION_STATUS } from '../models/RevisionSchedule.js';
import { Collection } from '../models/Collection.js';
import { TIMELINE_EVENT_TYPES } from '../constants/learningConstants.js';
import mongoose from 'mongoose';

class TimelineService {
  /**
   * Fetches the chronologically sorted timeline for a student.
   * Does not require a new collection. Merges recent activities dynamically.
   */
  static async getTimeline(userId, limit = 15) {
    const events = [];
    
    // 1. Fetch Resource Progress (Viewed / Completed)
    const progressList = await ResourceProgress.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('resourceId')
      .lean();

    progressList.forEach(prog => {
      if (!prog.resourceId) return;

      if (prog.completed && prog.completedAt) {
        events.push({
          eventType: TIMELINE_EVENT_TYPES.RESOURCE_COMPLETED,
          title: `Completed ${prog.resourceId.title}`,
          timestamp: prog.completedAt,
          metadata: { resourceId: prog.resourceId._id.toString(), slug: prog.resourceId.slug }
        });
      }

      // If accessed, add a viewed event
      if (prog.lastAccessedAt) {
        events.push({
          eventType: TIMELINE_EVENT_TYPES.RESOURCE_VIEWED,
          title: `Studied ${prog.resourceId.title}`,
          timestamp: prog.lastAccessedAt,
          metadata: { resourceId: prog.resourceId._id.toString(), slug: prog.resourceId.slug }
        });
      }
    });

    // 2. Fetch Preferences (Bookmarks / Favorites)
    const prefsList = await UserResourcePreference.find({ 
      userId, 
      $or: [{ isBookmarked: true }, { isFavorite: true }] 
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('resourceId')
      .lean();

    prefsList.forEach(pref => {
      if (!pref.resourceId) return;

      if (pref.isBookmarked) {
        events.push({
          eventType: TIMELINE_EVENT_TYPES.BOOKMARK_ADDED,
          title: `Bookmarked ${pref.resourceId.title}`,
          timestamp: pref.updatedAt,
          metadata: { resourceId: pref.resourceId._id.toString(), slug: pref.resourceId.slug }
        });
      }
      if (pref.isFavorite) {
        events.push({
          eventType: TIMELINE_EVENT_TYPES.FAVORITE_ADDED,
          title: `Favorited ${pref.resourceId.title}`,
          timestamp: pref.updatedAt,
          metadata: { resourceId: pref.resourceId._id.toString(), slug: pref.resourceId.slug }
        });
      }
    });

    // 3. Fetch Notes Created
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('resourceId')
      .lean();

    notes.forEach(note => {
      if (!note.resourceId) return;
      events.push({
        eventType: TIMELINE_EVENT_TYPES.NOTE_CREATED,
        title: `Wrote a note on ${note.resourceId.title}`,
        timestamp: note.createdAt,
        metadata: { resourceId: note.resourceId._id.toString(), slug: note.resourceId.slug }
      });
    });

    // 4. Fetch Completed Revisions
    const revisions = await RevisionSchedule.find({ 
      userId, 
      status: REVISION_STATUS.COMPLETED 
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('resourceId')
      .lean();

    revisions.forEach(rev => {
      if (!rev.resourceId) return;
      events.push({
        eventType: TIMELINE_EVENT_TYPES.REVISION_COMPLETED,
        title: `Completed revision for ${rev.resourceId.title}`,
        timestamp: rev.updatedAt,
        metadata: { resourceId: rev.resourceId._id.toString(), slug: rev.resourceId.slug }
      });
    });

    // 5. Fetch Collections Created
    const collections = await Collection.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    collections.forEach(col => {
      events.push({
        eventType: TIMELINE_EVENT_TYPES.COLLECTION_CREATED,
        title: `Created collection: ${col.name}`,
        timestamp: col.createdAt,
        metadata: { collectionId: col._id.toString() }
      });
    });

    // 6. Sort by timestamp descending and take top N
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Deduplicate identical events (e.g., viewed and completed at exactly the same time)
    const uniqueEvents = [];
    const seen = new Set();
    
    events.forEach(ev => {
      const key = `${ev.eventType}-${ev.metadata?.resourceId || ev.metadata?.collectionId}-${new Date(ev.timestamp).toISOString()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(ev);
      }
    });

    return uniqueEvents.slice(0, limit);
  }
}

export default TimelineService;
