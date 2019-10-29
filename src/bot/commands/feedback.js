const Markup = require("telegraf/markup");

module.exports = bot => {
  bot.hears("📞 Feedback", async ctx => {
    ctx.reply(
      "What do you think? Any thoughts are welcome 🤗",
      Markup.keyboard([["◀️ Go Back"]])
        .resize()
        .extra()
    );
    return ctx.scene.enter("askFeedback");
  });

  bot.hears("◀️ Go Back", async ctx => {
    ctx.reply("👀", ctx.mainMenu);
    if (ctx.scene) {
      ctx.scene.leave();
    }
  });
};
