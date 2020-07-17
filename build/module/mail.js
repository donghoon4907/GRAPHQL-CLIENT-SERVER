const nodemailer = require("nodemailer");

const smtpPool = require("nodemailer-smtp-pool");

module.exports = ({
  email,
  loginSecret
}) => {
  const config = {
    mailer: {
      service: "Gmail",
      host: "localhost",
      port: "465",
      user: process.env.MASTER_EMAIL_ID,
      password: process.env.MASTER_EMAIL_PW
    }
  };
  let transporter = nodemailer.createTransport(smtpPool({
    service: config.mailer.service,
    host: config.mailer.host,
    port: config.mailer.port,
    auth: {
      user: config.mailer.user,
      pass: config.mailer.password
    },
    tls: {
      rejectUnauthorize: false
    },
    maxConnections: 5,
    maxMessages: 10,
    pool: true
  }));
  return transporter.sendMail({
    from: `Master ${config.mailer.user}`,
    to: email,
    subject: `로그인 인증 코드 [${loginSecret}]`,
    html: ""
  });
};