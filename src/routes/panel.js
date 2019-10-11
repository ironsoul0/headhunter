const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Panel route was reached",
  });
});

module.exports = router;
