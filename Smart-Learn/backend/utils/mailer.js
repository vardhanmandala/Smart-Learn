const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  // Skip email if not configured
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log('📧 Email skipped (email service not configured)');
    return { success: true, skipped: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
