/* eslint-disable no-param-reassign */

const User = require("../models/user");
const students = require("../data/students.json");

const phrases = [
  "{1} was catched by {2} 👺",
  "Bad luck for {1} and +1 catch for {2} 🔥",
  "{2} stops the game for {1} in this round 😈",
];

const generatePhrase = (victim, killer) => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex]
    .replace("{1}", `<b>${victim}</b>`)
    .replace("{2}", `<b>${killer}</b>`);
};

module.exports = async (target, user, bot, byTime) => {
  target.killed = true;
  user.target = target.target;

  if (!byTime) {
    user.history.push({
      // eslint-disable-next-line no-underscore-dangle
      target: target._id,
      date: new Date(),
    });
    user.lastKill = new Date();
    user.kills += 1;

    const users = await User.find({
      active: true,
      killed: false,
    });

    const newTarget = await User.findById(target.target);
    bot.sendMessage(
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
    bot.sendMessage(
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

    const message = generatePhrase(
      students[target.pid].name,
      students[user.pid].name
    );

    users.forEach(el => {
      // eslint-disable-next-line no-underscore-dangle
      bot.sendMessage(el.chatId, message, {
        parse_mode: "HTML",
      });
    });

    /* bot.sendMessage(
      newTarget.chatId,
      "Be careful! New hunter is coming for you 🤭"
    ); */
  }
  await target.save();
  await user.save();
};
