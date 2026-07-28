import {
  createChatService,
  getChatsService,
} from "../services/chat.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const chat = await createChatService(req.user._id, receiverId);

    return successResponse(res, chat, "Chat created successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getChats = async (req, res) => {
  try {
    const users = await getChatsService(req.user._id);

    return successResponse(res, users, "Chats fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
