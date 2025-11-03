const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  // tls: {
  //   rejectUnauthorized: process.env.NODE_ENV === "production",
  // },
});

module.exports = transporter;
