const User = require("../../models/user");
const students = require("../../data/students.json");

const gameNotStarted = [
  "We are starting soon..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

module.exports = bot => {
  bot.hears("🔥 TOP Hunters", async ctx => {
    if (!ctx.gameStarted) {
      return ctx.reply(gameNotStarted);
    }
    const users = await User.find({}, ["kills", "pid"], {
      skip: 0,
      limit: 10,
      sort: {
        kills: -1,
      },
    });
    const top = users.map(
      (el, i) => `${i + 1}. ${students[el.pid]} \t ${el.kills}`
    );
    return ctx.reply(top.join("\n"));
  });
};
