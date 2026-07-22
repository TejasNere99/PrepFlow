import { sendSuccess } from '../../utils/apiResponse.js';
import { getAuthenticatedUser, loginUser, logoutUser, registerStudent } from '../services/authService.js';

export const login = async (req, res) => {
  const result = await loginUser(req.body);

  sendSuccess(res, 200, 'Login successful', result);
};

export const register = async (req, res) => {
  const result = await registerStudent(req.body);
  sendSuccess(res, 201, 'Registration successful', result);
};


export const me = async (req, res) => {
  const user = await getAuthenticatedUser(req.user.id);

  sendSuccess(res, 200, 'Authenticated user fetched successfully', {
    user,
  });
};

export const logout = async (req, res) => {
  const result = logoutUser();

  sendSuccess(res, 200, result.message);
};
