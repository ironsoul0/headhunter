const adminsList = [317786640, 671848828];

const notifyAdmins = (message, bot) => {
  adminsList.forEach(adminId => {
    bot.sendMessage(adminId, message, {
      parse_mode: "HTML",
    });
  });
};

module.exports = notifyAdmins;
