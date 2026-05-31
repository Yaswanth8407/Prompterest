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
      required: [true,"Create a username"],
      unique: [true,"Username already taken"],
      trim: true,
      lowercase: [true,"Only lowercase is allowed"],
    },

    email: {
      type: String,
      required: true,
      unique: [true,"Email already registered,try login instead"],
      lowercase: [true,"Only lowercase is allowed"],
      match: [/^\S+@\S+\.\S+$/,"Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: [8,"Password must be atleast 8 characters long"],
      // select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("user", userSchema);
