import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

// signup
export const registerService = async (body) => {
  const { username, emailOrPhone, password } = body;
  console.log(username, emailOrPhone, password);

  if (!emailOrPhone || !password) {
    throw new Error("Username and password are required.");
  }

  if (!emailOrPhone) {
    throw new Error("Email or phone number is required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  let email = null;
  let phoneNumber = null;

  if (emailRegex.test(emailOrPhone)) {
    email = emailOrPhone.toLowerCase();
  } else if (phoneRegex.test(emailOrPhone)) {
    phoneNumber = emailOrPhone;
  } else {
    throw new Error("Enter a valid email or phone number.");
  }

  const existingUser = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phoneNumber ? [{ phoneNumber }] : []),
    ],
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  return newUser;
};

// login
export const loginService = async (body) => {
  const { emailOrPhone, password } = body;

  if (!emailOrPhone || !password) {
    throw new Error("Email or Phone and password are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  let user;

  if (emailRegex.test(emailOrPhone)) {
    user = await User.findOne({
      email: emailOrPhone.toLowerCase(),
    });
  } else if (phoneRegex.test(emailOrPhone)) {
    user = await User.findOne({
      phoneNumber: emailOrPhone,
    });
  } else {
    throw new Error("Invalid email or phone number.");
  }

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateAccessToken(user);

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    token,
  };
};
