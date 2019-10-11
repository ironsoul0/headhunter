const nodemailer = require("nodemailer");

/**
 * Send an email
 *
 * @param  {String} html html to send
 * @param  {String} subject subject of an email
 * @param  {String} to email address
 */

async function sendEmail(html, subject, to) {
  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_LOGIN}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent", info.messageId);
}

module.exports = sendEmail;
