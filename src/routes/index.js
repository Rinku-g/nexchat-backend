import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUsers, getProfile } from "../controllers/user.controller.js";
import { createChat, getChats } from "../controllers/chat.controller.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

/* ===========================
   Authentication Routes
=========================== */

router.post("/register", register);
router.post("/login", login);

/* ===========================
   User Routes
=========================== */
// Profile
router.get("/profile", authMiddleware, getProfile);
router.post("/chats", authMiddleware, createChat);
router.get("/get-chats", authMiddleware, getChats);
router.get("/get-user-list", authMiddleware, getUsers);
router.post("/messages", authMiddleware, sendMessage);

router.get("/messages/:chatId", authMiddleware, getMessages);

// router.get("/users-list", authMiddleware, getUsersList);

export default router;
