const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const validateAdmin = require("../validators/admin");
const Setting = require("../models/setting");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });

  const isDisabled = await Setting.findOne({
    name: "admin.registration",
  });

  if (!isDisabled) {
    return res.status(400).send({
      success: false,
      message: "Admin registration is disabled",
    });
  }

  const adminExists = await Admin.findOne({
    login: req.body.login,
  });

  if (adminExists)
    return res.status(400).send({
      success: false,
      message: "Admin with this login exists",
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    login: req.body.login,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedAdmin = await admin.save();
    return res.send(savedAdmin);
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "DB Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  const admin = await Admin.findOne({
    login: req.body.login,
  });
  if (!admin)
    return res.status(400).send({
      success: false,
      message: "Wrong login",
    });
  const validPass = await bcrypt.compare(req.body.password, admin.password);
  if (!validPass)
    return res.status(400).send({
      success: false,
      message: "Wrong password",
    });

  const token = jwt.sign(
    {
      // eslint-disable-next-line no-underscore-dangle
      _id: admin._id,
    },
    process.env.TOKEN_SECRET
  );
  return res.header("auth-token", token).send({
    success: true,
    token,
  });
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Panel route was reached",
  });
});

module.exports = router;
