const Scene = require("telegraf/scenes/base");
const User = require("../../models/user");

const adminsList = [317786640, 671848828];

const askFeedback = new Scene("askFeedback");

const messageRecieved =
  "Your message was recieved! Thanks for your feedback, we will contact you if needed 😋";

askFeedback.on("message", async ctx => {
  const feedback = ctx.update.message.text;
  const chatId = ctx.update.message.from.id;
  const chatInfo = ctx.update.message.from;

  if (feedback.includes("Go Back")) {
    ctx.scene.leave();
    return ctx.reply("👀", ctx.mainMenu);
  }

  const user = await User.findOne({
    chatId,
  });

  const pid = user && user.pid;
  const email = user && user.email;
  const { username } = chatInfo;

  const content = [
    "New feeadback ✌️\n",
    `Student ID: <b>${pid || "No ID"}</b>`,
    `Email: <b>${email || "No Email"}</b>`,
    `Telegram: ${username ? `@${username}` : "Hidden"}\n`,
    feedback,
  ].join("\n");

  adminsList.forEach(adminId => {
    ctx.telegram.sendMessage(adminId, content, {
      parse_mode: "HTML",
    });
  });

  ctx.scene.leave();
  return ctx.reply(messageRecieved, ctx.mainMenu);
});

module.exports = askFeedback;
