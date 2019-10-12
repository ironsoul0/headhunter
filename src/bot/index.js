const TelegramBot = require("node-telegram-bot-api");
const commands = require("./commands");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

commands.forEach(commandHandler => {
  commandHandler(bot);
});

module.exports = bot;
