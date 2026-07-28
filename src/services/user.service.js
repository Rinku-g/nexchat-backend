import User from "../models/user.model.js";

export const getProfileService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getUserList = async (loggedInUserId) => {
  if (!loggedInUserId) {
    throw new Error("Login user id is required");
  }

  const users = User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  return users;
};
