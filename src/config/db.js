import mongoose from "mongoose";
import User from "../models/user.model.js";

const connetDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    await User.syncIndexes();
  
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connetDB;
