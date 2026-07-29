import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleLoginService = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({
    email: payload.email,
  });

  // User doesn't exist -> Create Google account
  if (!user) {
    user = await User.create({
      username: payload.name,
      email: payload.email,
      password: null,
      googleId: payload.sub,
      profilePicture: payload.picture,
      provider: "google",
    });
  }

  // User exists but registered using email/password
  else if (user.provider === "local" && !user.googleId) {
    user.googleId = payload.sub;
    user.profilePicture = payload.picture;
    await user.save();
  }

  // User already registered with Google
  else if (user.provider === "google") {
    // Optional: update profile picture or username
    user.profilePicture = payload.picture;
    user.username = payload.name;
    await user.save();
  }

  const accessToken = generateAccessToken(user);

  return {
    token: accessToken,
    user,
  };
};