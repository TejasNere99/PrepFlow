import { Router } from 'express';
import { authRouter } from '../auth/routes/authRoutes.js';
import { sheetRouter } from './sheetRoutes.js';
import { subjectRouter } from './subjectRoutes.js';
import { chapterRouter } from './chapterRoutes.js';
import { resourceRouter } from './resourceRoutes.js';
import { publicRouter } from './publicRoutes.js';
import { progressRouter } from './progressRoutes.js';
import { recentRouter } from './recentRoutes.js';
import { studentRouter } from './studentRoutes.js';
import { adminRouter } from './adminRoutes.js';

export const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'PrepFlow API Running',
  });
});

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
  });
});

router.use('/api/auth', authRouter);
router.use('/api/sheets', sheetRouter);
router.use('/api/subjects', subjectRouter);
router.use('/api/chapters', chapterRouter);
router.use('/api/resources', resourceRouter);
router.use('/api/public', publicRouter);
router.use('/api/progress', progressRouter);
router.use('/api/activity', recentRouter);
router.use('/api/student', studentRouter);
router.use('/api/admin', adminRouter);
