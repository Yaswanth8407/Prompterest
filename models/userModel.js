import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true,"Enter your name"],
      trim: true,
    },

    username: {
      type: String,
      required: [true,"Create a username"],
      unique: [true,"Username already taken"],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: [true,"Email already registered,try login instead"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/,"Invalid email"],
    },

    password: {
      type: String,
      required: true,
      // select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("user", userSchema);
