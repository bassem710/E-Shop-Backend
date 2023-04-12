const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // secure = false => 587
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    // Email Options
    const mailOptions = {
        from: "E-Commerce Backend <MAIL>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;