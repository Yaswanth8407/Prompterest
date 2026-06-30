import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    aiTool: {
      type: String,
      required: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      default: "",
    },
    tags: [
      {
        type: String,
        default: "",
      },
    ],
    visibility: {
      type: String,
      default: "",
    },
    coverPics: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("post", postSchema);
