const validateUser = require("../../utils/validateUser");

module.exports = bot => {
  bot.hears("👹 Catch the Aim", async ctx => {
    if (bot.context.killing) {
      return ctx.reply("It is too late 😈");
    }
    return validateUser(ctx, () => ctx.scene.enter("askSecret"));
  });
};
