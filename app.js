import express from "express";
import mongoose from "mongoose";
import path from "path";
import user from "./models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

dotenv.config();

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

app.get("/showlogin", (req, res) => {
  res.render("loginPage");
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

    res.redirect("/feed");
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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.findOne({ username });
    if (!foundUser) {
      return res.status(401).send("Invalid username or password");
    }
    const cmpresult = await bcrypt.compare(password, foundUser.password);
    if (cmpresult) {
      res.redirect("/feed");
    } else {
      return res.send("invalid username or password");
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/feed", (req, res) => {
  res.render("feedPage");
});

app.get("/profile", async (req, res) => {
  res.render("profilePage");
});

app.get("/addPost", (req, res) => {
  res.render("addPost");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});