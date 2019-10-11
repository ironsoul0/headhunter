const gameRouter = require("./game");
const panelRouter = require("./panel");

module.exports = [
  {
    path: "/game",
    router: gameRouter,
  },
  {
    path: "/panel",
    router: panelRouter,
  },
];
