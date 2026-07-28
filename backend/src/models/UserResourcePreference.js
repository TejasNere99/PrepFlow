import mongoose from 'mongoose';

const userResourcePreferenceSchema = new mongoose.Schema(
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
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userResourcePreferenceSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const UserResourcePreference = mongoose.model(
  'UserResourcePreference',
  userResourcePreferenceSchema,
);
