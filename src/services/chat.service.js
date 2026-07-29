import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const createChatService = async (loggedInUserId, receiverId) => {
  if (!receiverId) {
    throw new Error("This user is not registered. Invite them to join ChatApp."); 
  }

  if (loggedInUserId.toString() === receiverId) {
    throw new Error("You cannot create a chat with yourself");
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new Error("Receiver not found");
  }

  const existingChat = await Chat.findOne({
    participants: {
      $all: [loggedInUserId, receiverId],
    },
  });

  if (existingChat) {
    return existingChat;
  }

  // Create new chat
  const chat = await Chat.create({
    participants: [loggedInUserId, receiverId],
  });

  return chat;
};

export const getChatsService = async (loggedInUserId) => {
  const chats = await Chat.find({
    participants: loggedInUserId,
  })
    .populate("participants", "-password")
    .sort({ updatedAt: -1 });

  return chats.map((chat) => {
    const otherUser = chat.participants.find(
      (user) => user._id.toString() !== loggedInUserId.toString(),
    );

    return {
      _id: chat._id,
      user: otherUser,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  });
};
