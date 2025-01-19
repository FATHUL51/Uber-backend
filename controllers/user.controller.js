const { hash } = require("bcrypt");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const usetService = require("../services/user.service");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const isuser = await userModel.findOne({ email });
  if (isuser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });
  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, user });
};
module.exports.getUserProfile = async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ user });
};
module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  await BlacklistToken.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
