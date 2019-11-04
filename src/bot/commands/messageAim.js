const validateUser = require("../../utils/validateUser");

module.exports = bot => {
  bot.hears("🤳 Message the Aim", async ctx => {
    validateUser(ctx, () => ctx.scene.enter("askMessageForAim"));
  });

  bot.action("Reply to Hunter", ctx => {
    validateUser(ctx, () => ctx.scene.enter("askMessageForHunter"));
  });
};
