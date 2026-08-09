import mongoose from 'mongoose';
import { PLAN_TASK_STATUS, PLAN_TYPES } from '../constants/plannerConstants.js';

const scoringMetadataSchema = new mongoose.Schema(
  {
    weaknessScore: { type: Number, default: 0 },
    recommendationScore: { type: Number, default: 0 },
    revisionPriorityScore: { type: Number, default: 0 },
    learningStageScore: { type: Number, default: 0 },
    pendingResourceScore: { type: Number, default: 0 },
    stalenessScore: { type: Number, default: 0 },
    totalScore: { type: Number, required: true },
  },
  { _id: false },
);

const studyPlanTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    revisionScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RevisionSchedule',
      default: null,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    estimatedMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    originalEstimatedMinutes: {
      type: Number,
      default: null,
    },
    isPartial: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(PLAN_TASK_STATUS),
      default: PLAN_TASK_STATUS.UPCOMING,
      required: true,
      index: true,
    },
    priority: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    reasonType: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    scoringMetadata: {
      type: scoringMetadataSchema,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planType: {
      type: String,
      enum: Object.values(PLAN_TYPES),
      required: true,
      index: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    weekStartDate: {
      type: Date,
      default: null,
      index: true,
    },
    weekEndDate: {
      type: Date,
      default: null,
    },
    settings: {
      dailyStudyMinutes: { type: Number, required: true },
      preferredStudyDays: [{ type: Number, min: 0, max: 6 }],
      preferredSubjects: [{ type: String, trim: true }],
      preferredStudyTime: { type: String, trim: true, default: '' },
    },
    totalEstimatedMinutes: {
      type: Number,
      default: 0,
    },
    tasks: {
      type: [studyPlanTaskSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

studyPlanSchema.index({ userId: 1, planType: 1, scheduledDate: 1 });
studyPlanSchema.index({ userId: 1, 'tasks.taskId': 1 });
studyPlanSchema.index({ userId: 1, weekStartDate: 1, weekEndDate: 1 });

export const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
