const User = require("../models/user");

const gameNotStarted = [
  "We are starting soon..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

const notRegistered =
  "Seems you did not register for the game. You are unfortunately not allowed to enter the game now 😭";

const wasKilled =
  "You were caught by one of the hunters. You are unfortunately not allowed to take participation now 😭";

const gameEnded = "The game has officially ended, stay tuned for updates 😋";

module.exports = async (ctx, callback) => {
  if (ctx.gameEnded) {
    return ctx.reply(gameEnded);
  }

  if (!ctx.gameStarted) {
    return ctx.reply(gameNotStarted);
  }

  // let chatId = ctx.update.message.from && ctx.update.message.from.id;
  const resource = ctx.update.callback_query || ctx.update.message;
  const chatId = resource.from.id;

  const user = await User.findOne({
    chatId,
  });
  if (!user) {
    return ctx.reply(notRegistered);
  }
  if (user.killed) {
    return ctx.reply(wasKilled);
  }
  return callback();
};
