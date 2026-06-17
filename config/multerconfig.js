import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
import sharp from "sharp";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(import.meta.dirname,"../public/uploads/profilepics"));
//   },
//   filename: async function (req, file, cb) {
//     const foundCredentials = jwt.verify(req.cookies.PrompterestAuthToken, process.env.JWT_SECRET)

//     sharp(foundCredentials.username +
//       path.extname(file.originalname))
      
//     const Finalfilename = foundCredentials.username +
//       path.extname(file.originalname);
      
//     await user.findOneAndUpdate({username: foundCredentials.username},{
//       profilepic: "uploads/profilepics/" + Finalfilename,
//     })
//     cb(null, Finalfilename);
//   },
// });

// const upload = multer({ storage: storage });


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
export default upload