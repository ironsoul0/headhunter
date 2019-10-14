const Telegraf = require("telegraf");
const commands = require("./commands");

const bot = new Telegraf(process.env.BOT_TOKEN);

commands.forEach(commandHandler => {
  commandHandler(bot);
});

bot.launch();

module.exports = bot;
