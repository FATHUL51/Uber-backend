const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const server = require("./server");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db.js");
const userRoutes = require("./routes/user.routes.js");
const captainRoutes = require("./routes/captain.routes.js");

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);

module.exports = app;
