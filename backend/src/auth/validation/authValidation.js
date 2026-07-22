import { ApiError } from '../../utils/ApiError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return next(new ApiError(400, 'Valid email is required'));
  }

  if (typeof password !== 'string' || password.length === 0) {
    return next(new ApiError(400, 'Password is required'));
  }

  return next();
};

export const validateRegisterRequest = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError(400, 'Name, email, and password are required'));
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    return next(new ApiError(400, 'Name must be at least 2 characters long'));
  }

  if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return next(new ApiError(400, 'Valid email is required'));
  }

  if (typeof password !== 'string' || password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters long'));
  }

  return next();
};
