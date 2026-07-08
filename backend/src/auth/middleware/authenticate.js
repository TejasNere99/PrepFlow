import { User } from '../../models/User.js';
import { ApiError } from '../../utils/ApiError.js';
import { verifyAuthToken } from '../../utils/jwt.js';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }

  return null;
};

export const authenticate = async (req, res, next) => {
  try {
    let token = getBearerToken(req.headers.authorization) || req.cookies?.token;

    if (!token) {
      throw new ApiError(401, 'Authentication token is required');
    }

    // Strip surrounding quotes and whitespace if present
    token = token.trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    if (token.startsWith("'") && token.endsWith("'")) {
      token = token.slice(1, -1);
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
    console.error('Authentication error:', error.message);
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
};
