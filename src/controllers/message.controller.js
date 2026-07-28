import {
  sendMessageService,
  getMessagesService,
} from "../services/message.service.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const message = await sendMessageService(chatId, req.user._id, text);

    return successResponse(res, message, "Message sent successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await getMessagesService(chatId);

    return successResponse(res, messages, "Messages fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
