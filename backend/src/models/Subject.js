import mongoose from 'mongoose';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

const subjectSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CONTENT_STATUS),
      default: CONTENT_STATUS.DRAFT,
      required: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

subjectSchema.index({ title: 'text' });
subjectSchema.index({ sheetId: 1, order: 1 });

export const Subject = mongoose.model('Subject', subjectSchema);
