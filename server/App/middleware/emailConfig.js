const nodemailer = require("nodemailer");
require("dotenv").config()
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.MAILING_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILING_EMAIL,
    pass: process.env.NODEMAILING_PASSWORD,
  },
});

module.exports={transporter}