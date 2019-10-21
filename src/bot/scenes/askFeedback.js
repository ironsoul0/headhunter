const Scene = require("telegraf/scenes/base");

const adminsList = [317786640, 671848828];

const askFeedback = new Scene("askFeedback");

const messageRecieved =
  "Your message was recieved! Thanks for your feedback, we will contact you if needed 😋";

askFeedback.on("message", async ctx => {
  const feedback = ctx.update.message.text;
  const chatInfo = ctx.update.message.from;
  const content = [`@${chatInfo.username} has left feedback:`, feedback].join(
    "\n\n"
  );
  adminsList.forEach(adminId => {
    ctx.telegram.sendMessage(adminId, content);
  });
  ctx.scene.leave();
  return ctx.reply(messageRecieved, ctx.mainMenu);
});

module.exports = askFeedback;
