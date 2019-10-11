const express = require("express");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

const routes = require("./routes");
const commands = require("./commands");

const bootstrap = async () => {
  dotenv.config();

  const app = express();
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

  commands.forEach(commandHandler => {
    commandHandler(bot);
  });

  app.use((req, _, next) => {
    req.bot = bot;
    next();
  });

  routes.forEach(route => {
    app.use(route.path, route.router);
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

bootstrap();
