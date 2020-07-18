const nodemailer = require("nodemailer");
const htmlVerification = require("../template/verification");

exports.send = (data) => {
  const auth = {
    service: "gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  };
  const transporter = nodemailer.createTransport(auth);
  const mailOptions = {
    from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL}>`,
    to: `${data.username} <${data.email}>`,
    subject: "Verifikasi",
    html: htmlVerification.template(data),
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
