import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { User } from '../models/User.js';

const seedAdmin = async () => {
  await connectDatabase();

  const existingAdmin = await User.findOne({
    email: 'admin@prepflow.com',
  });

  if (existingAdmin) {
    console.log('Default administrator already exists');
    return;
  }

  await User.create({
    name: 'PrepFlow Admin',
    email: 'admin@prepflow.com',
    password: 'Admin123',
    role: USER_ROLES.ADMIN,
  });

  console.log('Default administrator created');
};

seedAdmin()
  .catch((error) => {
    console.error('Failed to seed default administrator', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
