const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const validateAdmin = require("../validators/admin");
const Setting = require("../models/setting");
const verify = require("../utils/verify");
const User = require("../models/user");
const students = require("../data/students.json");

const router = express.Router();

const setSetting = async set => {
  if (!set) {
    return {
      success: false,
      message: "No setting",
    };
  }
  let setting = await Setting.findOne({
    setting: set,
  });
  if (!setting) {
    setting = new Setting({
      setting: set,
      value: true,
    });
  } else {
    setting.value = !setting.value;
  }
  await setting.save();
  return {
    success: true,
    setting: setting.value,
  };
};

router.post("/register", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.send({
      success: false,
      message: error.details[0].message,
    });

  const isDisabled =
    (await Setting.findOne({
      setting: "adminReg",
    })) || {};

  if (isDisabled.value) {
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

router.get("/settings", verify, async (req, res) => {
  if (!req.query.setting) {
    return res.send({
      success: false,
      message: "No setting",
    });
  }
  const setting = await Setting.findOne({
    setting: req.query.setting,
  });
  return res.send({
    success: true,
    setting: setting ? setting.value : false,
  });
});

router.post("/settings", verify, async (req, res) => {
  if (!req.body.setting) {
    return res.send({
      success: false,
      message: "No setting",
    });
  }
  let setting = await Setting.findOne({
    setting: req.body.setting,
  });
  if (!setting) {
    setting = new Setting({
      setting: req.body.setting,
      value: true,
    });
  } else {
    setting.value = !setting.value;
  }
  if (req.body.setting === "gameStarted") {
    req.bot.context.gameStarted = setting.value;
  }
  await setting.save();
  return res.send({
    success: true,
    setting: setting.value,
  });
});

router.get("/game/start", verify, async (req, res) => {
  if (!(await Setting.findOne({ setting: "usersShuffled" }))) {
    return res.send({
      success: false,
      message: "Players are not shuffled",
    });
  }
  if (req.bot.context.gameStarted) {
    return res.send({
      success: false,
      message: "Already started",
    });
  }
  const setting = await setSetting("gameStarted");
  if (!setting.success) {
    return res.send({
      success: false,
      message: "Error occured",
    });
  }
  req.bot.context.gameStarted = true;
  const users = await User.find({ active: true });
  await users.forEach(async user => {
    const target = await User.findById(user.target);
    req.bot.telegram.sendMessage(
      user.chatId,
      [
        "Game starts!",
        "Here is your target:",
        students[target.pid].name,
        target.pid,
      ].join("\n")
    );
  });
  return res.send({
    success: true,
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

router.get("/users/about/:id", verify, async (req, res) => {
  if (req.params.id) {
    return res.send({
      success: false,
      message: "No id",
    });
  }
  const user = await User.findById(req.params.id);
  return res.send({
    success: true,
    user,
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
    await setSetting("usersShuffled");
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

router.post("/sendMessage", verify, async (req, res) => {
  if (!req.body.message) {
    return res.send({
      success: false,
      message: "No message",
    });
  }
  const users = await User.find({ active: true });
  users.forEach(user => {
    console.log(user);
    req.bot.telegram.sendMessage(user.chatId, req.body.message);
  });
  return res.json({
    success: true,
    message: "Message was sent",
  });
});

module.exports = router;
