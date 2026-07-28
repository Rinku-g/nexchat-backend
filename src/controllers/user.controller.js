import { getProfileService, getUserList } from "../services/user.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getProfile = async (req, res) => {
  try {
    const users = await getProfileService(req.user._id);
    return successResponse(res, users, "Profile fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUserList(req.user._id);

    return successResponse(res, users, "Users fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
