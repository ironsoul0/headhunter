const validateUser = require("../../utils/validateUser");

module.exports = bot => {
  bot.hears("👹 Catch the Aim", async ctx => {
    if (bot.context.killing) {
      return ctx.reply("Registration is closed now 😭");
    }
    return validateUser(ctx, () => ctx.scene.enter("askSecret"));
  });
};
