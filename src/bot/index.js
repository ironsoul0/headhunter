const Telegraf = require("telegraf");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");

const commands = require("./commands");
const scenes = require("./scenes");

const bot = new Telegraf(process.env.BOT_TOKEN);

const { leave } = Stage;
const stage = new Stage(scenes);
stage.command("cancel", leave());

bot.context.gameStarted = false; /* Should be set to false at 12:00 AM */

bot.use(session());
bot.use(stage.middleware());

commands.forEach(commandHandler => {
  commandHandler(bot);
});

bot.catch(error => {
  console.log(
    "Telegraf error",
    error.response,
    error.parameters,
    error.on || error
  );
});

bot.startPolling();

module.exports = bot;
