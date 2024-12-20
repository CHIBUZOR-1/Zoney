const nodemailer = require("nodemailer");

const sendMail = async (user, subj, mssg) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      port: parseInt(process.env.PORTZ, 10), // Ensure port is a number
      secure: process.env.SECURE === 'true', // Convert to boolean
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user,
      subject: subj,
      html: mssg,
    });

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendMail }