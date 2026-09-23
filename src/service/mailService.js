const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_SERVICE_USER,
    pass: process.env.MAIL_SERVICE_PASSWORD,
  },
  maxConnections: 5,
  rateLimit: 10,
});

async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendMail };
