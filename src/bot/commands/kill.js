const gameNotStarted = [
  "We are starting soon..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

module.exports = bot => {
  bot.hears("👹 Catch the Aim", ctx => {
    if (!ctx.gameStarted) {
      return ctx.reply(gameNotStarted);
    }
    return ctx.scene.enter("askSecret");
  });
};
