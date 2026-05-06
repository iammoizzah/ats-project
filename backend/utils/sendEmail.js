const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"ATS Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;