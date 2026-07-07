import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { login, logout, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateLoginRequest } from '../validation/authValidation.js';

export const authRouter = Router();

authRouter.post('/login', validateLoginRequest, asyncHandler(login));
authRouter.get('/me', authenticate, asyncHandler(me));
authRouter.post('/logout', authenticate, asyncHandler(logout));
