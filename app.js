import express from "express";
import mongoose from "mongoose";
import path from "path";
import user from "./models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

dotenv.config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/showSignup", (req, res) => {
  res.render("signupPage");
});

app.get("/showLogin", (req, res) => {
  res.render("loginPage");
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash("yaswanth0000", 10);

    const User = await user.create({
      fullname: "Mattaparthi Yaswanth",
      username: "yaswanth0804",
      email: "mattaparthiyaswanth00@gmail.com",
      password: hashedPass,
    });
    res.send(User);
    console.log(User);
  } catch (err) {
    res.send(err);
  }
});

app.post("/login", async (req, res) => {
  // console.log(res.body);
  const User = await user.findOne({ email: "mattaparthiyaswanth00@gmail.com" });
  res.send(await bcrypt.compare("yaswanth0000", User.password));
});

app.get("/feed", (req, res) => {
  res.render("feedPage");
});

app.get("/profile", (req, res) => {
  res.render("profilePage");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
