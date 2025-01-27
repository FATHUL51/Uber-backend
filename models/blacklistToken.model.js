const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});
const BlacklistToken = mongoose.model("BlacklistToken", tokenSchema);
module.exports = BlacklistToken;
