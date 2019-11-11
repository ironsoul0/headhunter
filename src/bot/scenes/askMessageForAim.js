const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const User = require("../../models/user");

const askMessageForAim = new Scene("askMessageForAim");

const messageRecieved = "Your aim recieved the message. Stay tuned 👣";

askMessageForAim.enter(ctx => {
  ctx.reply(
    "All right! Just send me the message for your aim 😈",
    Markup.keyboard([["◀️ Go Back"]])
      .resize()
      .extra()
  );
});

askMessageForAim.on("message", async ctx => {
  const message = ctx.update.message.text;
  const chatId = ctx.update.message.from.id;

  if (message.includes("◀️ Go Back")) {
    ctx.reply("👀", ctx.mainMenu);
    return ctx.scene.leave();
  }

  const user = await User.findOne({
    chatId,
  });

  const target = await User.findById(user.target);
  const content = [
    "Your hunter has left message for you 😮",
    `<b>${message}</b>`,
  ].join("\n\n");

  try {
    ctx.telegram.sendMessage(
      target.chatId,
      content,
      Extra.HTML().markup(m =>
        m.inlineKeyboard([m.callbackButton("Reply 🤫", "Reply to Hunter")])
      )
    );
  } catch (err) {
    console.log(err);
  }

  ctx.scene.leave();
  return ctx.reply(messageRecieved, ctx.mainMenu);
});

module.exports = askMessageForAim;
