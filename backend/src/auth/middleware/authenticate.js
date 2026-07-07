import { User } from '../../models/User.js';
import { ApiError } from '../../utils/ApiError.js';
import { verifyAuthToken } from '../../utils/jwt.js';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.split(' ')[1];
};

export const authenticate = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization) || req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Unauthorized');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode >= 500) {
      return next(error);
    }

    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
};
