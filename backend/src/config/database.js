import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    console.warn('MONGODB_URI is not defined. Skipping MongoDB connection.');
    return;
  }

  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
};
