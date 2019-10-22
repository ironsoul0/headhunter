/* eslint-disable no-param-reassign */

const User = require("../models/user");
const students = require("../data/students.json");

module.exports = async (target, user, bot) => {
  target.killed = true;
  user.target = target.target;
  user.history.push({
    // eslint-disable-next-line no-underscore-dangle
    target: target._id,
    date: new Date(),
  });
  user.lastKill = new Date();
  user.kills += 1;

  const newTarget = await User.findById(target.target);
  await bot.sendMessage(
    user.chatId,
    [
      `Congratulate you with your ${user.kills} catch, hunter! 🎯`,
      `Here is your new target: <b>${students[newTarget.pid].name}</b>\n`,
      "Be careful 🤫",
    ].join("\n"),
    {
      parse_mode: "HTML",
    }
  );
  await bot.sendMessage(
    target.chatId,
    [
      "You have been catched 😨",
      `Your score: <b>${target.kills}</b> kill(-s)\n`,
      "HeadHunter will never forget you 🥺",
    ].join("\n"),
    {
      parse_mode: "HTML",
    }
  );
  await bot.sendMessage(
    newTarget.chatId,
    "Be careful! New hunter is coming for you 🤭"
  );
  await target.save();
  await user.save();
};
