const Extra = require("telegraf/extra");

const deadlinePassed = false; // TBA

module.exports = bot => {
  bot.hears("🦍 Become a Hunter", ctx => {
    if (deadlinePassed) {
      ctx.reply("Registration is closed now 😭");
    } else {
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
      "Visit https://uenify.com to get one and then run the command again 😉"
    );
  });
};
