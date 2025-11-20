const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create the Transporter (The Post Office Truck)
  // It needs your email service credentials from .env
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE, // e.g., "gmail"
    auth: {
      user: process.env.SMPT_MAIL, // Your email address
      pass: process.env.SMPT_PASSWORD, // Your App Password (Not login password)
    },
  });

  // 2. Define the Email Options (The Letter)
  const mailOptions = {
    from: process.env.SMPT_MAIL, // Sender address
    to: options.email, // Receiver address
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
    // html: options.html        // You can add HTML here later for pretty emails
  };

  // 3. Send the Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
