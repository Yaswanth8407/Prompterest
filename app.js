import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/showSignup", (req, res) => {
  res.render("signupPage");
});

app.get("/showLogin", (req, res) => {
  res.render("loginPage");
});

app.post("/signup", (req, res) => {
  console.log(res.body);
});

app.post("/login", (req, res) => {
  console.log(res.body);
});

app.get("/feed", (req, res) => {
  res.render("feedPage");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
