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

const usedToken =
  "This token is already used by someone else. Make sure you copy-pasted it from the e-mail we have sent you 🧐";

askToken.on("message", async ctx => {
  if (ctx.gameStarted) {
    ctx.reply("Registration is closed now 😭");
  } else {
    const chatId = ctx.update.message.from.id;
    await ctx.telegram.sendChatAction(chatId, "typing");
    const token = ctx.update.message.text;
    const user = await User.findOne({
      token,
    });

    if (user && user.chatId) {
      await ctx.reply(usedToken);
      ctx.scene.leave();
      return;
    }

    if (user) {
      ctx.reply(validToken);
      await User.findOneAndUpdate(
        {
          token,
        },
        {
          active: true,
          chatId,
        }
      );
    } else {
      await ctx.reply(invalidToken);
    }
  }

  ctx.scene.leave();
});

module.exports = askToken;
