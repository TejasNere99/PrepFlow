import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { login, logout, me, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateLoginRequest, validateRegisterRequest } from '../validation/authValidation.js';

export const authRouter = Router();

authRouter.post('/login', validateLoginRequest, asyncHandler(login));
authRouter.post('/register', validateRegisterRequest, asyncHandler(register));
authRouter.get('/me', authenticate, asyncHandler(me));
authRouter.post('/logout', authenticate, asyncHandler(logout));
