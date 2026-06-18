import express from "express";
import mongoose from "mongoose";
import path from "path";
import user from "./models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import upload from "./config/multerconfig.js";
import sharp from "sharp";
import post from "./models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const port = 3000;

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/showSignup", (req, res) => {
  res.render("signupPage", { formData: {} });
});

app.post("/signup", async (req, res) => {
  const { fullname, username, email, password } = req.body;
  try {
    if (!password || password.length < 8) {
      return res.render("signupPage", {
        alert: "Password must be atleast 8 characters long",
        formData: {
          fullname,
          username,
          email,
          password,
        },
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await user.create({
      fullname,
      username,
      email,
      password: hashedPass,
    });

    const token = jwt.sign(
      {
        username,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("PrompterestAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800000,
    });

    res.redirect("/showeditprofile");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMsg = Object.values(err.errors)[0].message;
      return res.render("signupPage", {
        alert: errorMsg,
        formData: {
          fullname,
          username,
          email,
        },
      });
    }

    return res.render("signupPage", {
      alert: err.message,
      formData: {
        fullname,
        username,
        email,
        password,
      },
    });
  }
});

app.get("/showlogin", (req, res) => {
  if (req.cookies.PrompterestAuthToken) {
    return res.redirect("/feed");
  }
  res.render("loginPage");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.findOne({ username });
    if (!foundUser) {
      return res.status(401).send("Invalid username or password");
    }
    const cmpresult = await bcrypt.compare(password, foundUser.password);
    if (cmpresult) {
      const token = jwt.sign(
        {
          username: foundUser.username,
          email: foundUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("PrompterestAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800000,
      });

      res.redirect("/feed");
    } else {
      return res.send("invalid username or password");
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const foundUsername = jwt.verify(
      req.cookies.PrompterestAuthToken,
      process.env.JWT_SECRET,
    ).username;
    const foundCredentials = await user.findOne({ username: foundUsername });
    res.render("feedPage", { foundCredentials });
  } catch (err) {
    console.log(err);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const foundUsername = jwt.verify(
      req.cookies.PrompterestAuthToken,
      process.env.JWT_SECRET,
    ).username;
    const foundCredentials = await user.findOne({ username: foundUsername });
    res.render("profilePage", { foundCredentials });
  } catch (err) {
    console.log(err);
  }
});

app.get("/showeditprofile", async (req, res) => {
  try {
    const foundUsername = jwt.verify(
      req.cookies.PrompterestAuthToken,
      process.env.JWT_SECRET,
    ).username;
    const foundCredentials = await user.findOne({ username: foundUsername });
    res.render("EditProfile", { foundCredentials });
  } catch (err) {
    console.log(err);
  }
});

app.post("/editprofile", upload.single("profilepic"), async (req, res) => {
  try {
    const foundUsername = jwt.verify(
      req.cookies.PrompterestAuthToken,
      process.env.JWT_SECRET,
    ).username;
    const foundCredentials = await user.findOne({ username: foundUsername });
    const { fullname, username, bio, birthday, gender } = req.body;
    const profileImageName = `${username}.webp`;

    const profilepic = await cloudinary.v2.uploader.upload(
      sharp(req.file.buffer).webp({ quality: 80 }),
    );

    console.log(profilepic);

    // await user.findOneAndUpdate(
    //   { username },
    //   {
    //     profilepic: `uploads/profilepics/${profileImageName}`,
    //   },
    // );

    if (
      foundCredentials.fullname !== fullname ||
      foundCredentials.username !== username ||
      foundCredentials.bio !== bio ||
      foundCredentials.gender !== gender ||
      foundCredentials.birthday !== birthday
    ) {
      await user.findOneAndUpdate(
        { username: foundCredentials.username },
        {
          fullname,
          username,
          bio,
          birthday,
          gender,
        },
      );
    }

    res.redirect("/profile");
  } catch (err) {
    console.log(err);
  }
});

app.get("/showaddpost", (req, res) => {
  res.render("addPost");
});

app.post("/addpost", async (req, res) => {
  try {
    const { title, desc, prompt, aiTool, category, tags, visibility } =
      req.body;

    await post.create({
      title,
      desc,
      prompt,
      aiTool,
      category,
      tags,
      visiblity,
    });
    res.redirect("/showaddpost");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
