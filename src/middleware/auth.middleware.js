import User from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Token not found", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded?.id).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
