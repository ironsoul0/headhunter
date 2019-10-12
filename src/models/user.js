const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  pid: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  kills: {
    type: Number,
    default: 0,
  },
  target: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  secret: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
