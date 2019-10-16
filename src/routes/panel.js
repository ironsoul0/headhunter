const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const validateAdmin = require("../validators/admin");
const Setting = require("../models/setting");
const verify = require("../utils/verify");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.send({
      success: false,
      message: error.details[0].message,
    });

  const isDisabled = await Setting.findOne({
    name: "admin.registration",
  });

  if (!isDisabled) {
    return res.send({
      success: false,
      message: "Admin registration is disabled",
    });
  }

  const adminExists = await Admin.findOne({
    login: req.body.login,
  });

  if (adminExists)
    return res.send({
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
    return res.send({
      success: false,
      message: "DB Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.send({
      success: false,
      message: error.details[0].message,
    });
  const admin = await Admin.findOne({
    login: req.body.login,
  });
  if (!admin)
    return res.send({
      success: false,
      message: "Wrong login",
    });
  const validPass = await bcrypt.compare(req.body.password, admin.password);
  if (!validPass)
    return res.send({
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

router.get("/users/all", verify, async (req, res) => {
  const query = req.query.active
    ? {
        active: true,
      }
    : {};
  const users = await User.find(query);
  res.send({
    success: true,
    users,
  });
});

router.get("/users/shuffle", verify, async (req, res) => {
  try {
    const users = await User.find({
      active: true,
    });

    for (let i = users.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }

    users.forEach(async (user, i) => {
      // eslint-disable-next-line no-underscore-dangle
      users[i].target = users[i < users.length - 1 ? i + 1 : 0]._id;
      await users[i].save();
    });
    return res.send({
      success: true,
      users,
    });
  } catch (err) {
    return res.send({
      success: false,
    });
  }
});

module.exports = router;
