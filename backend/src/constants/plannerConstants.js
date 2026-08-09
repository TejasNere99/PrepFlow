export const PLAN_TYPES = Object.freeze({
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
});

export const PLAN_TASK_STATUS = Object.freeze({
  UPCOMING: 'UPCOMING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
  RESCHEDULED: 'RESCHEDULED',
});

export const PLAN_REASON_TYPES = Object.freeze({
  WEAK_TOPIC: 'WEAK_TOPIC',
  OVERDUE_REVISION: 'OVERDUE_REVISION',
  SMART_RECOMMENDATION: 'SMART_RECOMMENDATION',
  CONTINUE_STAGE: 'CONTINUE_STAGE',
  PENDING_RESOURCE: 'PENDING_RESOURCE',
});

export const PLANNER_DEFAULTS = Object.freeze({
  dailyStudyMinutes: 120,
  fallbackResourceMinutes: 30,
  minimumSplitMinutes: 15,
  preferredStudyDays: [1, 2, 3, 4, 5, 6],
  weeklyDays: 7,
  maxCandidateResources: 250,
});
