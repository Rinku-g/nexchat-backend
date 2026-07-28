import { loginService, registerService } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);
    return successResponse(res, user, "Register Successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginService(req.body);
    return successResponse(res, user, "Login Successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
