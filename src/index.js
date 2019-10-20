const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const routes = require("./routes");
const bot = require("./bot");

const bootstrap = async () => {
  const app = express();

  app.use((req, _, next) => {
    req.bot = bot;
    next();
  });

  app.use(cors());

  app.use(bodyParser.json());

  routes.forEach(route => {
    app.use(route.path, route.router);
  });

  mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to Mongo");
    });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

bootstrap();
