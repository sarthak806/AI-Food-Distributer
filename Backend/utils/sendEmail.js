const axios = require('axios');

const sendEmail = async (to, subject, text, html) => {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const from = process.env.BREVO_SENDER_EMAIL?.trim();

    if (!apiKey || !from) {
        const error = new Error('Email delivery is not configured.');
        error.code = 'EMAIL_NOT_CONFIGURED';
        throw error;
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'ShareBite', email: from },
                to: [{ email: to }],
                subject,
                textContent: text || 'Please enable HTML to view this email',
                htmlContent: html,
            },
            {
                headers: {
                    'api-key': apiKey,
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
                timeout: 15000,
            },
        );
        console.log('Email sent through Brevo API:', response.data.messageId);
        return true;
    } catch (error) {
        console.error('Brevo API email error:', {
            message: error.message,
            status: error.response?.status,
            details: error.response?.data?.message || error.response?.data?.code,
        });
        if (error.response?.status === 401) {
            const authError = new Error('The email provider rejected the API key.');
            authError.code = 'EMAIL_UNAUTHORIZED';
            throw authError;
        }
        throw error;
    }
};

module.exports = sendEmail;
