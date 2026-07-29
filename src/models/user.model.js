// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     sparse: true,
//     default: null,
//   },
//   phoneNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     default: null,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });
// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    password: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);