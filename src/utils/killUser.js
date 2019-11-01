/* eslint-disable no-param-reassign */

const User = require("../models/user");
const students = require("../data/students.json");

module.exports = async (target, user, bot, byTime) => {
  target.killed = true;
  user.target = target.target;
  if(!byTime){
    user.history.push({
      // eslint-disable-next-line no-underscore-dangle
      target: target._id,
      date: new Date(),
    });
    user.lastKill = new Date();
    user.kills += 1;
  }
  const users = await User.find({
    acitve: true,
    killed: false
  });
  const newTarget = await User.findById(target.target);
  await bot.sendMessage(
    user.chatId,
    [
      (byTime ? "Your target was deactivated for inactivity." : `Congratulate you with your ${user.kills} catch, hunter! 🎯`),
      `Here is your new target: <b>${students[newTarget.pid].name}</b>\n`,
      "Be careful 🤫",
    ].join("\n"), {
      parse_mode: "HTML",
    }
  );
  await bot.sendMessage(
    target.chatId,
    [
      (byTime ? "You have been deactivated for inactivity" : "You have been catched 😨"),
      `Your score: <b>${target.kills}</b> kill(-s)\n`,
      "HeadHunter will never forget you 🥺",
    ].join("\n"), {
      parse_mode: "HTML",
    }
  );
  if (!byTime) {
    const message = `${students[target.pid].name} was killed by ${students[users.pid]}`;
    users.forEach(el => {
      if (el._id !== user._id && el._id !== target._id) {
        bot.sendMessage(el.chatId, message);
      }
    })
  }
  await bot.sendMessage(
    newTarget.chatId,
    "Be careful! New hunter is coming for you 🤭"
  );
  await target.save();
  await user.save();
};