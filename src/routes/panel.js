const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const validateAdmin = require("../validators/admin");
const Setting = require("../models/setting");
const verify = require("../utils/verify");
const killUser = require("../utils/killUser");
const User = require("../models/user");
const students = require("../data/students.json");
const sendEmail = require("../utils/mailer");

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
  if (
    !(await Setting.findOne({
      setting: "usersShuffled",
    }))
  ) {
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
  const users = await User.find({
    active: true,
  });
  const totalActive = users.length;
  await users.forEach(async user => {
    const target = await User.findById(user.target);
    req.bot.telegram.sendMessage(
      user.chatId,
      [
        `Halloween is finally there, ${totalActive} hunters joined.. 🎃`,
        `Your first target: <b>${students[target.pid].name}</b>\n`,
        "May the luck be with you 😈",
      ].join("\n"),
      {
        parse_mode: "HTML",
      }
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
  if (!req.params.id) {
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

router.get("/users/killTarget/:id", verify, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || !user.active || user.killed) {
    return res.send({
      success: false,
      message: "Can not kill for this user",
    });
  }

  const target = await User.findById(user.target);
  await killUser(target, user, req.bot.telegram);

  return res.send({
    success: true,
  });
});

router.get("/users/shuffle", verify, async (req, res) => {
  try {
    const users = await User.find({
      active: true,
    });

    if (users.length === 0) {
      return res.send({
        success: false,
        message: "No active users",
      });
    }

    for (let i = users.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }

    users.forEach(async (user, i) => {
      // eslint-disable-next-line no-underscore-dangle
      users[i].target = users[i < users.length - 1 ? i + 1 : 0]._id;
      await users[i].save();
    });
    const shuffled = await Setting.findOne({
      setting: "usersShuffled",
    });
    if (!shuffled) {
      await setSetting("usersShuffled");
    }
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
  const users = await User.find({
    active: true,
  });
  users.forEach(user => {
    console.log(user);
    req.bot.telegram.sendMessage(
      user.chatId,
      req.body.message,
      req.bot.context.mainMenu
    );
  });
  return res.json({
    success: true,
    message: "Message was sent",
  });
});

router.post("/sendMessage/:id", verify, async (req, res) => {
  if (!req.body.message || !req.params.id) {
    return res.send({
      success: false,
      message: "No message or id",
    });
  }
  const user = await User.findById(req.params.id);
  req.bot.telegram.sendMessage(user.chatId, req.body.message);

  return res.json({
    success: true,
    message: "Message was sent",
  });
});

router.post("/killByTime", verify, async (req, res) => {
  if (!req.body.timestamp) {
    return res.send({
      success: false,
      message: "No timestamp",
    });
  }
  if (
    !(await Setting.findOne({
      setting: "usersShuffled",
    }))
  ) {
    return res.send({
      success: false,
      message: "Players are not shuffled",
    });
  }
  const users = await User.find({
    active: true,
    killed: false,
    lastKill: {
      $lt: req.body.timestamp,
    },
  });

  const becomeDead = new Set();
  const targetChanged = new Set();

  // eslint-disable-next-line no-restricted-syntax
  for (const target of users) {
    // eslint-disable-next-line no-await-in-loop
    const user = await User.findOne({
      // eslint-disable-next-line no-underscore-dangle
      target: target._id,
    });
    // eslint-disable-next-line no-await-in-loop
    await killUser(target, user, req.bot, true);
    becomeDead.add(target.chatId);
    targetChanged.add(user.chatId);
  }

  becomeDead.forEach(dead => {
    targetChanged.delete(dead);
    const message = "You were deactivated because of inactivity 😭";
    req.bot.telegram.sendMessage(dead, message);
  });

  targetChanged.forEach(async chatId => {
    const info = await User.findOne({ chatId });
    const newTarget = await User.findById(info.target);

    req.bot.telegram.sendMessage(
      chatId,
      [
        `Your previous target was deactivated because of inactivity 😣`,
        `Here is your new target: <b>${students[newTarget.pid].name}</b>\n`,
        "Good luck 🤞",
      ].join("\n"),
      { parse_mode: "HTML" }
    );
  });

  return res.send({
    success: true,
    message: "Killed",
  });
});

router.get("/notifyInactive", verify, async (_, res) => {
  const users = await User.find({
    active: false,
  });

  users.forEach(async user => {
    try {
      await sendEmail(
        `
          <html>
            <body>
              <h1>You did not complete the registration!</h1>
              <p>As a final step, you have to use your token to login into our <a href="https://t.me/nu_headhunter_bot">Telegram bot</a></p>
              <p>Here is your token: <b>${user.token}</b></p>
            </body>
          </html>
        `,
        "HeadHunter Incomplete Registration",
        user.email
      );
    } catch (err) {
      console.log(err);
    }
  });

  return res.send({
    success: true,
  });
});

module.exports = router;
