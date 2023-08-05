const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mailgun = require("mailgun-js");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  //const sendEmail = async (subject, message, send_to, sent_from) => {

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
// apiKey:sandbox956414568f2f486aa3986f15d874aa8d.mailgun.org,
// domain: 5b42c3eab5c4ec24d134fd08ef497d91-bdb2c8b4-e4cd3af7 ,
});
  const data = {
    from: sent_from,
    to: send_to,
   replyTo: reply_to,
    subject: subject,
    html: message,
  };

  try {
    await mg.messages().send(data);
    console.log("Mailgun email sent successfully!");
  } catch (error) {
    console.log("Error sending Mailgun email:", error);
    throw new Error("Email not sent, please try again");
  }
};

module.exports = sendEmail;

