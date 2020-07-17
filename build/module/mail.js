"use strict";

var nodemailer = require("nodemailer");

var smtpPool = require("nodemailer-smtp-pool");

module.exports = function (_ref) {
  var email = _ref.email,
      loginSecret = _ref.loginSecret;
  var config = {
    mailer: {
      service: "Gmail",
      host: "localhost",
      port: "465",
      user: process.env.MASTER_EMAIL_ID,
      password: process.env.MASTER_EMAIL_PW
    }
  };
  var transporter = nodemailer.createTransport(smtpPool({
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
    from: "Master ".concat(config.mailer.user),
    to: email,
    subject: "\uB85C\uADF8\uC778 \uC778\uC99D \uCF54\uB4DC [".concat(loginSecret, "]"),
    html: ""
  });
};