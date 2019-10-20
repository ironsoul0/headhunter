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
  killed: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
  },
  history: {
    type: Array,
    default: [],
  },
  lastKill: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("User", userSchema);
