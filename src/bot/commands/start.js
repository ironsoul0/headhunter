const Markup = require("telegraf/markup");

const response = [
  "Hi there!",
  "Wanna try yourself being a hunter? Use the keyboard to become one! 😈",
  "Witch-ing you a spook-tacular Halloween! 🎃",
].join("\n\n");

module.exports = bot => {
  bot.start(({ reply }) => {
    return reply(
      response,
      Markup.keyboard([
        ["🦍 Become a Hunter", "🔥 TOP Hunters"],
        ["👁 Game Status", "👹 Catch the Aim"],
        ["📢 Personal Info", "📞 Feedback"],
      ])
        .resize()
        .extra()
    );
  });
};
