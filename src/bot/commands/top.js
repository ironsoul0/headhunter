const User = require("../../models/User");

const gameNotStarted = [
  "We are starting soon..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

module.exports = bot => {
  bot.hears("🔥 TOP Hunters", ctx => {
    if (!ctx.gameStarted) {
      ctx.reply(gameNotStarted);
    }
  });
};
