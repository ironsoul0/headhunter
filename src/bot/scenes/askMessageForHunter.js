const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const User = require("../../models/user");

const askMessageForHunter = new Scene("askMessageForHunter");

const messageRecieved = "Your hunter recieved the message. Stay tuned 👣";

askMessageForHunter.enter(ctx => {
  ctx.reply(
    "Seems you a risky person! Just send me the message for your hunter 👺",
    Markup.keyboard([["◀️ Go Back"]])
      .resize()
      .extra()
  );
});

askMessageForHunter.on("message", async ctx => {
  const message = ctx.update.message.text;
  const chatId = ctx.update.message.from.id;

  if (message.includes("◀️ Go Back")) {
    ctx.reply("👀", ctx.mainMenu);
    return ctx.scene.leave();
  }

  const user = await User.findOne({
    chatId,
  });

  const hunter = await User.findOne({
    // eslint-disable-next-line no-underscore-dangle
    target: user._id,
  });

  const content = [
    "Your aim has left message for you 😏",
    `<b>${message}</b>`,
  ].join("\n\n");

  ctx.telegram.sendMessage(
    hunter.chatId,
    content,
    Extra.HTML().markup(m =>
      m.inlineKeyboard([m.callbackButton("Reply 🤫", "Reply to Aim")])
    )
  );

  ctx.scene.leave();
  return ctx.reply(messageRecieved, ctx.mainMenu);
});

module.exports = askMessageForHunter;
