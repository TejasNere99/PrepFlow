import mongoose from 'mongoose';

const REVISION_STATUS = {
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
  MISSED: 'MISSED',
  CANCELLED: 'CANCELLED',
};

const revisionScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(REVISION_STATUS),
      default: REVISION_STATUS.UPCOMING,
    },
  },
  {
    timestamps: true,
  },
);

export const RevisionSchedule = mongoose.model('RevisionSchedule', revisionScheduleSchema);
export { REVISION_STATUS };
