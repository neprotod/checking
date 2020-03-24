const nodemailer = require('nodemailer');

async function mail(email) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.rambler.ru',
    auth: {
      user: 'betterTeamChecking@rambler.ru',
      pass: 'Checking1223',
    },
  });

  await transporter.sendMail({
    from: 'betterTeamChecking@rambler.ru',
    to: email,
    subject: 'Welcome ✔',
    text:
      'Congratulations! You are successfully registered on https://better-team-checking.herokuapp.com!',
  });
}

module.exports = {
  mail,
};
