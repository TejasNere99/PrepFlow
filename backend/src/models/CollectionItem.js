import mongoose from 'mongoose';

const collectionItemSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

collectionItemSchema.index({ collectionId: 1, resourceId: 1 }, { unique: true });

export const CollectionItem = mongoose.model('CollectionItem', collectionItemSchema);
