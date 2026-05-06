const nodemailer = require("nodemailer");

const getTransporter = () => {
    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        SMTP_SECURE
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error("Missing SMTP env vars. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: String(SMTP_SECURE).toLowerCase() === "true",
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
};

exports.sendEmail = async ({ to, subject, html, text }) => {
    const transporter = getTransporter();

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    return transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    });
};
