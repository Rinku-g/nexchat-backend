import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
});
export default mongoose.model("User", userSchema);
