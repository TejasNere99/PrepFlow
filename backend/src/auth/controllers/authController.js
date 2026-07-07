import { sendSuccess } from '../../utils/apiResponse.js';
import { getAuthenticatedUser, loginAdmin, logoutUser } from '../services/authService.js';

export const login = async (req, res) => {
  const result = await loginAdmin(req.body);

  sendSuccess(res, 200, 'Login successful', result);
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
