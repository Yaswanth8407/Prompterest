import mongoose from "mongoose";

const userModel = mongoose.Schema({
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
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/],
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    
  },
});

export default mongoose.model("User", userModel);
