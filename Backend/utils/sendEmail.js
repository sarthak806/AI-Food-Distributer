const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
    const host = process.env.BREVO_SMTP_HOST;
    const port = Number(process.env.BREVO_SMTP_PORT || 587);
    const user = process.env.BREVO_SMTP_USER;
    const pass = process.env.BREVO_SMTP_KEY;
    const from = process.env.BREVO_SENDER_EMAIL;

    if (!host || !user || !pass || !from) {
        throw new Error('Brevo SMTP is not configured. Set BREVO_SMTP_HOST, BREVO_SMTP_USER, BREVO_SMTP_KEY, and BREVO_SENDER_EMAIL.');
    }
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('BREVO_SMTP_PORT must be a valid port number.');
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    try {
        const result = await transporter.sendMail({
            from: { name: 'ShareBite', address: from },
            to,
            subject,
            text: text || 'Please enable HTML to view this email',
            html,
        });
        console.log('Email sent through Brevo SMTP:', result.messageId);
        return true;
    } catch (error) {
        console.error('Brevo SMTP Error:', {
            message: error.message,
            code: error.code,
            responseCode: error.responseCode,
            command: error.command,
        });
        throw error;
    }
};

module.exports = sendEmail;
