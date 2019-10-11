const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  req.bot.sendMessage(317786640, "Hi there!");
  res.json({
    message: "Message was sent",
  });
});

module.exports = router;
