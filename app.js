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

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
