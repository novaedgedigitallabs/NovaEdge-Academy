const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE || "gmail",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"NovaEdge Academy" <${process.env.SMPT_MAIL}>`,
    to: options.email,
    cc: options.cc || undefined,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
