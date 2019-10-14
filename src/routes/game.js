const express = require("express");
const uuid = require("uuidv4").default;

const User = require("../models/User");
const validateRegistration = require("../validators/registration");
const students = require("../data/students.json");
const sendEmail = require("../utils/mailer");

const router = express.Router();

router.get("/", (req, res) => {
  req.bot.telegram.sendMessage(317786640, "Hi there!");
  res.json({
    message: "Message was sent",
  });
});

router.get("/register", async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  if (req.body.email.split("@")[1] !== "nu.edu.kz") {
    return res.status(400).send({
      success: false,
      message: "Use NU email",
    });
  }
  const student = students[req.body.pid];
  if (
    !student ||
    !req.body.email.includes(student.name.split(" ")[1].toLowerCase())
  )
    return res.status(400).send({
      success: false,
      message: "Wrong ID or email",
    });

  const userExists = await User.findOne({
    pid: req.body.pid,
  });

  if (userExists)
    return res.status(400).send({
      success: false,
      message: "Already exists",
    });

  const token = uuid();

  const user = new User({
    pid: req.body.pid,
    email: req.body.email,
    secret: req.body.secret,
    token,
  });

  sendEmail(
    `
      <html>
        <body>
          <h1>You have successfully registered</h1>
          <p>Here is your token: <b>${token}</b></p>
          <p>Use it to login into our <a href="https://t.me/bot">Telegram bot</a></p>
        </body>
      </html>
    `,
    "Headhunter Instructions",
    req.body.email
  );

  try {
    await user.save();
    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "Error during registration",
    });
  }
});

module.exports = router;
