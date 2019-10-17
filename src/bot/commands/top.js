const User = require("../../models/user");
const students = require("../../data/students.json");

const gameNotStarted = [
  "This command is not available yet..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

const convert = value => {
  return String(value).padStart(2, "0");
};

module.exports = bot => {
  bot.hears("🔥 TOP Hunters", async ctx => {
    if (ctx.gameStarted) {
      return ctx.reply(gameNotStarted);
    }
    const users = await User.find();
    let topUsers = users.filter(user => user.kills > 0);

    topUsers.sort((x, y) => {
      if (
        x.kills < y.kills ||
        (x.kills === y.kills && x.lastKill > y.lastKill)
      ) {
        return 1;
      }
      if (
        x.kills > y.kills ||
        (x.kills === y.kills && x.lastKill < y.lastKill)
      ) {
        return -1;
      }
      return 0;
    });

    topUsers = topUsers.slice(0, 9).map((user, index) => {
      const killDate = user.lastKill;
      const prefix = `${convert(killDate.getDate())}/${convert(
        killDate.getMonth()
      )}`;
      const suffix = `${convert(killDate.getHours())}:${convert(
        killDate.getMinutes()
      )}`;

      const { name } = students[user.pid];
      const { kills } = user;
      const lastKill = `${prefix} at ${suffix}`;

      return `${index + 1}. ${name} - <b>${kills}</b> kills - ${lastKill}`;
    });

    if (topUsers.length === 0) {
      return ctx.reply("Seems there are no any kills yet.. 🤭");
    }
    return ctx.replyWithHTML(
      `Most dangerous hunters 😈\n\n${topUsers.join("\n")}`
    );
  });
};
