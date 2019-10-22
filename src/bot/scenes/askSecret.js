const Scene = require("telegraf/scenes/base");

const User = require("../../models/user");
const killUser = require("../../utils/killUser");

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
    await killUser(target, user, ctx.telegram);
  } else {
    await ctx.reply("Wrong secret phrase, try better 🙈");
  }

  ctx.scene.leave();
});

module.exports = askSecret;
