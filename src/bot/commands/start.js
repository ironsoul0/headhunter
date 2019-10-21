const response = [
  "Hi there!",
  "Wanna try yourself being a hunter? Use the keyboard to become one! 😈",
  "Witch-ing you a spook-tacular Halloween! 🎃",
].join("\n\n");

module.exports = bot => {
  bot.start(ctx => {
    return ctx.reply(response, ctx.mainMenu);
  });
};
