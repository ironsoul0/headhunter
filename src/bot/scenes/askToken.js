const Scene = require("telegraf/scenes/base");

const askToken = new Scene("askToken");

askToken.enter(ctx => {
  ctx.replyWithHTML("Okay, what is your unqiue <b>token</b>?");
});
askToken.on("message", ctx => {
  // const token = ctx.update.message.text;
  ctx.reply("Yeap, token is valid! Welcome on board 🥳");
  ctx.scene.leave();
});

module.exports = askToken;
