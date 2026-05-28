import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      // select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("user", userSchema);
