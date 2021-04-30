const express = require("express");
const cors = require("cors");
const db = require("./models/db");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const userRoutes = require("./routes/user.route");
const filesRoutes = require("./routes/files.route");
const memesRoutes = require("./routes/memes.route");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  "/public/uploads",
  express.static(path.resolve(__dirname + "/../" + "public/uploads"))
);

app.use("/user", userRoutes);
app.use("/files", filesRoutes);
app.use("/memes", memesRoutes);

app.get("/", (req, res) => {
  res.send(path.resolve(__dirname + "/../" + "public"));
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
