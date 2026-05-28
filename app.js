import express from "express";
import mongoose from "mongoose";
import path from "path";
import user from "./models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
// import cookieParser from "cookie-parser";

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

app.get("/showlogin", (req, res) => {
  res.render("loginPage");
});

app.post("/signup", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    const User = await user.create({
      fullname,
      username,
      email,
      password: hashedPass,
    });
    res.redirect("/feed");
  } catch (err) {
    res.send(err);
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

app.get("/profile", (req, res) => {
  res.render("profilePage");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
