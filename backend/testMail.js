require("dotenv").config();
const { sendMail } = require("./utils/mailer");

sendMail(
  "kiranmayikondeti45@gmail.com",
  "Test OTP",
  "This is a test mail"
).then(() => {
  console.log("Mail sent");
}).catch(console.error);
