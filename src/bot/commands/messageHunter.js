const validateUser = require("../../utils/validateUser");

module.exports = bot => {
  bot.hears("👁 Message the Hunter", async ctx => {
    validateUser(ctx, () => ctx.scene.enter("askMessageForHunter"));
  });

  bot.action("Reply to Aim", ctx => {
    validateUser(ctx, () => ctx.scene.enter("askMessageForAim"));
  });
};
