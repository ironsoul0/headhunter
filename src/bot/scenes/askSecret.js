const Scene = require("telegraf/scenes/base");

const User = require("../../models/user");
const students = require("../../data/students.json");

const askSecret = new Scene("askSecret");

askSecret.enter(ctx => {
  ctx.replyWithHTML("What is the secrect phrase of your target? 🔮");
});

askSecret.on("message", async ctx => {
  const chatId = ctx.update.message.from.id;
  await ctx.telegram.sendChatAction(chatId, "typing");

  const secret = ctx.update.message.text;

  const user = await User.findOne({
    chatId,
  });

  const target = await User.findById(user.target);

  if (target && secret === target.secret) {
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
    await ctx.replyWithHTML(
      [
        `Congratulate you with your ${user.kills} catch, hunter! 🎯`,
        `Here is your new target: <b>${students[newTarget.pid].name}</b>\n`,
        "Be careful 🤫",
      ].join("\n")
    );
    await ctx.telegram.sendMessage(
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
    await ctx.telegram.sendMessage(
      newTarget.chatId,
      "Be careful! New hunter is coming for you 🤭"
    );
    await target.save();
    await user.save();
  } else {
    await ctx.reply("Wrong secret phrase, try better 🙈");
  }

  ctx.scene.leave();
});

module.exports = askSecret;
