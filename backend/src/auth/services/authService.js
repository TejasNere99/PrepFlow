import { User } from '../../models/User.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateAuthToken } from '../../utils/jwt.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'User account is inactive');
  }

  return {
    token: generateAuthToken(user),
    user: sanitizeUser(user),
  };
};

export const registerStudent = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: 'STUDENT',
    isActive: true,
  });

  return {
    token: generateAuthToken(user),
    user: sanitizeUser(user),
  };
};


export const getAuthenticatedUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Unauthorized');
  }

  return sanitizeUser(user);
};

export const logoutUser = () => ({
  message: 'Logout successful',
});
