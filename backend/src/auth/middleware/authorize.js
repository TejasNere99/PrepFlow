import { ApiError } from '../../utils/ApiError.js';

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden'));
  }

  return next();
};
