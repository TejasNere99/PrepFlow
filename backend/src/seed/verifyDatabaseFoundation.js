import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';

const testSlugPrefix = 'sprint-3-database-foundation-test';

const cleanupTestData = async () => {
  const sheets = await Sheet.find({
    slug: new RegExp(`^${testSlugPrefix}`),
  }).select('_id');
  const sheetIds = sheets.map((sheet) => sheet._id);

  const subjects = await Subject.find({
    $or: [
      { slug: new RegExp(`^${testSlugPrefix}`) },
      { sheetId: { $in: sheetIds } },
    ],
  }).select('_id');
  const subjectIds = subjects.map((subject) => subject._id);

  const chapters = await Chapter.find({
    $or: [
      { slug: new RegExp(`^${testSlugPrefix}`) },
      { subjectId: { $in: subjectIds } },
    ],
  }).select('_id');
  const chapterIds = chapters.map((chapter) => chapter._id);

  await Resource.deleteMany({
    $or: [
      { slug: new RegExp(`^${testSlugPrefix}`) },
      { chapterId: { $in: chapterIds } },
    ],
  });
  await Chapter.deleteMany({ _id: { $in: chapterIds } });
  await Subject.deleteMany({ _id: { $in: subjectIds } });
  await Sheet.deleteMany({ _id: { $in: sheetIds } });
};

const verifyDatabaseFoundation = async () => {
  await connectDatabase();
  await Promise.all([Sheet.init(), Subject.init(), Chapter.init(), Resource.init()]);

  await cleanupTestData();

  const sheet = await Sheet.create({
    title: 'Sprint 3 Test Sheet',
    description: 'Temporary sheet for database foundation verification.',
    slug: `${testSlugPrefix}-sheet`,
    status: CONTENT_STATUS.ACTIVE,
    order: 1,
    metadata: {
      estimatedHours: 10,
      difficulty: 'Intermediate',
    },
    tags: ['temporary', 'database-test'],
  });

  const subject = await Subject.create({
    sheetId: sheet._id,
    title: 'Sprint 3 Test Subject',
    description: 'Temporary subject for database foundation verification.',
    slug: `${testSlugPrefix}-subject`,
    icon: 'database',
    order: 1,
    status: CONTENT_STATUS.ACTIVE,
    metadata: {
      language: 'English',
    },
    tags: ['temporary'],
  });

  const chapter = await Chapter.create({
    subjectId: subject._id,
    title: 'Sprint 3 Test Chapter',
    description: 'Temporary chapter for database foundation verification.',
    slug: `${testSlugPrefix}-chapter`,
    order: 1,
    status: CONTENT_STATUS.ACTIVE,
    metadata: {
      expectedQuestions: 5,
    },
    tags: ['temporary'],
  });

  const resource = await Resource.create({
    chapterId: chapter._id,
    title: 'Sprint 3 Test Resource',
    description: 'Temporary resource for database foundation verification.',
    slug: `${testSlugPrefix}-resource`,
    resourceType: 'playlist',
    url: 'https://example.com/prepflow-test-resource',
    order: 1,
    status: CONTENT_STATUS.ACTIVE,
    metadata: {
      teacher: 'Verification Script',
    },
    tags: ['temporary'],
  });

  const linkedResource = await Resource.findById(resource._id).populate({
    path: 'chapterId',
    populate: {
      path: 'subjectId',
      populate: {
        path: 'sheetId',
      },
    },
  });

  const referencesAreValid =
    linkedResource?.chapterId?._id.equals(chapter._id) &&
    linkedResource.chapterId.subjectId?._id.equals(subject._id) &&
    linkedResource.chapterId.subjectId.sheetId?._id.equals(sheet._id);

  if (!referencesAreValid) {
    throw new Error('Database hierarchy reference verification failed');
  }

  console.log('Database foundation verification passed');
};

verifyDatabaseFoundation()
  .catch((error) => {
    console.error('Database foundation verification failed', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cleanupTestData();
    await mongoose.disconnect();
  });
