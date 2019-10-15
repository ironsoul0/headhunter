const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  setting: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
