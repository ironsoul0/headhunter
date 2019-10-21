const User = require("../../models/user");

const gameNotStarted = [
  "We are starting soon..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

const notRegistered =
  "Seems you did not register for the game. You are unfortunately not allowed to enter the game now 😭";

const wasKilled =
  "You were catched by one of the hunters. You are unfortunately not allowed to catch anyone now 😭";

module.exports = bot => {
  bot.hears("👹 Catch the Aim", async ctx => {
    if (!ctx.gameStarted) {
      return ctx.reply(gameNotStarted);
    }
    const chatId = ctx.update.message.from.id;
    const user = await User.findOne({
      chatId,
    });
    if (!user) {
      return ctx.reply(notRegistered);
    }
    if (user.killed) {
      return ctx.reply(wasKilled);
    }
    return ctx.scene.enter("askSecret");
  });
};
