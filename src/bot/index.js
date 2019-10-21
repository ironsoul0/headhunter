const Telegraf = require("telegraf");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const Markup = require("telegraf/markup");

const Setting = require("../models/setting");

const commands = require("./commands");
const scenes = require("./scenes");

const bot = new Telegraf(process.env.BOT_TOKEN);

const { leave } = Stage;
const stage = new Stage(scenes);
stage.command("cancel", leave());

const initSettings = async () => {
  const initialyStarted = await Setting.findOne({
    setting: "gameStarted",
  });
  const gameStarted = initialyStarted ? initialyStarted.value : false;
  console.log(`Setting loaded: gameStarted == ${gameStarted}`);
  bot.context.gameStarted = gameStarted;
};

initSettings();

bot.use(session());
bot.use(stage.middleware());

bot.context.mainMenu = Markup.keyboard([
  ["🦍 Become a Hunter", "🔥 TOP Hunters"],
  ["📢 Personal Info", "📞 Feedback"],
  ["👹 Catch the Aim"],
])
  .resize()
  .extra();

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
