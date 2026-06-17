import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
import sharp from "sharp";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
export default upload