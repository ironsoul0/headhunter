const Scene = require("telegraf/scenes/base");
const User = require("../../models/user");
const students = require("../../data/students.json");

const askSecret = new Scene("askSecret");

askSecret.enter(ctx => {
  ctx.replyWithHTML("What is the secrect phrase of your target");
});

askSecret.on("message", async ctx => {
  await ctx.reply("One second, sir..");

  const secret = ctx.update.message.text;

  const user = await User.findOne({
    chatId: ctx.update.message.from.id,
  });

  const target = await User.findById(user.target);

  if (secret === target.secret) {
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
    await ctx.reply(
      [
        "Here is your new target:",
        students[newTarget.pid].name,
        newTarget.pid,
      ].join("\n")
    );
    await ctx.telegram.sendMessage(
      target.chatId,
      ["You have been killed", `Your score: ${target.kills} kill(-s)`].join(
        "\n"
      )
    );
    await ctx.telegram.sendMessage(
      newTarget.chatId,
      "Be careful new killer is coming for you"
    );
    await target.save();
    await user.save();
  } else {
    await ctx.reply("Wrong secret phrase");
  }

  ctx.scene.leave();
});

module.exports = askSecret;
