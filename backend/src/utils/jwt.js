import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const TOKEN_EXPIRATION = '7d';

export const generateAuthToken = (user) => {
  if (!env.jwtSecret) {
    throw new ApiError(500, 'JWT secret is not configured');
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: TOKEN_EXPIRATION,
    },
  );
};

export const verifyAuthToken = (token) => {
  if (!env.jwtSecret) {
    throw new ApiError(500, 'JWT secret is not configured');
  }

  return jwt.verify(token, env.jwtSecret);
};
