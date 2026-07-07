import mongoose from 'mongoose';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

const resourceSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
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
    resourceType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    storageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(CONTENT_STATUS),
      default: CONTENT_STATUS.DRAFT,
      required: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
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

resourceSchema.index({ title: 'text' });
resourceSchema.index({ chapterId: 1, order: 1 });

export const Resource = mongoose.model('Resource', resourceSchema);
