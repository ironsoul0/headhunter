const User = require("../../models/user");
const students = require("../../data/students.json");

const gameNotStarted = [
  "This command is not available yet..",
  "Wait while the clock strikes on Halloween 🎃",
].join("\n\n");

const notRegistered = [
  "Seems you are not a hunter yet..",
  "Use the bot keyboard to become one 😈",
].join("\n\n");

const getAlive = async () => {
  const count = await User.count({ active: true, killed: false });
  return count;
};

module.exports = bot => {
  bot.hears("📢 Personal Info", async ctx => {
    if (!ctx.gameStarted) {
      return ctx.reply(gameNotStarted);
    }

    const chatId = ctx.update.message.from.id;

    await ctx.telegram.sendChatAction(chatId, "typing");
    const user = await User.findOne({
      chatId,
    });

    if (!user) {
      return ctx.reply(notRegistered);
    }

    const { target: targetId, kills, secret, killed } = user;
    const target = await User.findById(targetId);
    const targetName = students[target.pid].name;
    const aliveHunters = await getAlive();

    const info = [
      "Here is some information you should know 🧠\n",
      `My target: <b>${targetName}</b>`,
      `My score: <b>${kills} catches</b>`,
      `My secret: <b>${secret}</b>`,
      `Am I alive: <b>${killed ? "No" : "Yes"}</b>`,
      `Hunters still alive: <b>${aliveHunters}</b>`,
    ].join("\n");

    return ctx.replyWithHTML(info);
  });
};
