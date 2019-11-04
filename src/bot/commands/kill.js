const validateUser = require("../../utils/validateUser");

module.exports = bot => {
  bot.hears("👹 Catch the Aim", async ctx => {
    validateUser(ctx, () => ctx.scene.enter("askSecret"));
  });
};
