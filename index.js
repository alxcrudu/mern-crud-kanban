const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dbConnect = require("./database/db.js");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const build = path.join(__dirname, "client", "build");
app.use(express.static(build));

// mongoDB
dbConnect();

// routes
app.get("/", async (req, res) => {
  res.sendFile(path.join(build, "index.html"));
});
app.use("/api/v1", require("./src/v1/routes"));

app.listen(port, console.log(`Server started at ${port} and serving HTML`));
