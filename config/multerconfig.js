import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(import.meta.dirname,"../public/uploads"));
  },
  filename: function (req, file, cb) {
    const Finalfilename =
      jwt.verify(req.cookies.PrompterestAuthToken, process.env.JWT_SECRET)
        .username +
      Date.now() +
      path.extname(file.originalname);
    cb(null, Finalfilename);
  },
});

const upload = multer({ storage: storage });

export default upload
