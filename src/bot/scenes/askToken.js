const Scene = require("telegraf/scenes/base");
const User = require("../../models/user");

const askToken = new Scene("askToken");

askToken.enter(ctx => {
  ctx.replyWithHTML(
    "Okay, what is your unqiue <b>token</b>? Just copy-paste it here."
  );
});

const validToken = [
  "Yeap, token is valid! Welcome on board 🥳",
  "You will recieve the name of your aim when the clock strikes on Halloween. Be prepared 😈",
].join("\n");

const invalidToken =
  "Seems that token is invalid. Make sure you copy-pasted it from the e-mail we have sent you 🧐";

askToken.on("message", async ctx => {
  await ctx.reply("One second, sir..");

  const token = ctx.update.message.text;
  const user = await User.findOne({
    token,
  });

  if (user) {
    ctx.reply(validToken);
    await User.findOneAndUpdate(
      { token },
      {
        active: true,
        chatId: ctx.update.message.from.id,
      }
    );
  } else {
    await ctx.reply(invalidToken);
  }

  ctx.scene.leave();
});

module.exports = askToken;
