import { Router } from 'express';

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
