const nodemailer = require("nodemailer");
const htmlVerification = require("../template/verification");

exports.send = (data) => {
  const auth = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "bobby.torp79@ethereal.email",
      pass: "fECsqZp7JXh2kwXSB9",
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
