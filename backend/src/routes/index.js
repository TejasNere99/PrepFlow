import { Router } from 'express';
import { authRouter } from '../auth/routes/authRoutes.js';
import { sheetRouter } from './sheetRoutes.js';

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

