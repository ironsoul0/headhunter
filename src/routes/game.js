const express = require("express");
const uuid = require("uuidv4").default;

const User = require("../models/user");
const validateRegistration = require("../validators/registration");
const students = require("../data/students.json");
const sendEmail = require("../utils/mailer");

const router = express.Router();

router.get("/playersAlive", async (req, res) => {
  const count = await User.count({active: true, killed: false})
  res.send({
    success: true,
    count
  })
})

router.post("/register", async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error)
    return res.send({
      success: false,
      message: error.details[0].message,
    });
  if (req.body.email.split("@")[1] !== "nu.edu.kz") {
    return res.send({
      success: false,
      message: "Use NU email",
    });
  }

  const secretPattern = /([A-Za-z0-9]){4,15}/;
  const { secret } = req.body;
  const result = secret.match(secretPattern);
  if (!result || result[0] !== secret) {
    return res.send({
      success: false,
      message: "Invalid secret",
    });
  }

  const student = students[req.body.pid];
  if (
    !student ||
    !req.body.email.includes(student.name.split(" ")[1].toLowerCase())
  )
    return res.send({
      success: false,
      message: "Wrong ID or email",
    });

  const userExists = await User.findOne({
    pid: req.body.pid,
  });

  if (userExists)
    return res.send({
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
          <p>Use it to login into our <a href="https://t.me/nu_headhunter_bot">Telegram bot</a></p>
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
