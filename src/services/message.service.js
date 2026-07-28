import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const sendMessageService = async (chatId, senderId, text) => {
  if (!chatId || !senderId || !text) {
    throw new Error("All fields are required");
  }

  // Check chat exists
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Create message
  const message = await Message.create({
    chatId,
    sender: senderId,
    text,
  });

  // Update chat's last message
  chat.lastMessage = text;
  chat.lastMessageAt = new Date();

  await chat.save();

  return message;
};

export const getMessagesService = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required");
  }

  const messages = await Message.find({
    chatId,
  })
    .populate("sender", "username profilePicture")
    .sort({ createdAt: 1 });

  return messages;
};
