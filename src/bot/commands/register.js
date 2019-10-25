const Extra = require("telegraf/extra");
const User = require("../../models/user");

module.exports = bot => {
  bot.hears("🦍 Become a Hunter", async ctx => {
    if (ctx.gameStarted) {
      ctx.reply("Registration is closed now 😭");
    } else {
      const chatId = ctx.update.message.from.id;
      const existingUser = await User.findOne({ chatId });

      if (existingUser) {
        ctx.reply("You are already a hunter 😉");
        return;
      }

      ctx.reply(
        "Did you recieve a token from our website?",
        Extra.HTML().markup(m =>
          m.inlineKeyboard([
            m.callbackButton("Yes, let's go 🌪", "Token"),
            m.callbackButton("Not yet 🌝", "No token"),
          ])
        )
      );
    }
  });

  bot.action(/.+/, ctx => {
    if (ctx.match[0] === "Token") {
      return ctx.scene.enter("askToken");
    }
    return ctx.reply(
      "Visit https://trytohunt.me to get one and then run the command again 😉"
    );
  });
};
