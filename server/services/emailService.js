const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

// Create reusable transporter using SMTP credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,     // your email address
    pass: process.env.SMTP_PASS,     // app password (not your login password)
  },
});

/**
 * Sends an OTP email to the specified address.
 * @param {string} to      - recipient email
 * @param {string} otp     - 6-digit OTP string
 * @param {string} purpose - "verification" | "login"
 */
const sendOtpEmail = async (to, otp, purpose = "verification") => {
  const isLogin = purpose === "login";

  const subject = isLogin
    ? "Your Login OTP"
    : "Verify Your Email Address";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333;">${isLogin ? "Login OTP" : "Email Verification"}</h2>
      <p style="color: #555; font-size: 15px;">
        ${isLogin
          ? "Use the OTP below to complete your login."
          : "Use the OTP below to verify your email address and activate your account."}
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2d2d2d; background: #f4f4f4; padding: 12px 24px; border-radius: 6px;">${otp}</span>
      </div>
      <p style="color: #999; font-size: 13px;">This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #bbb; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${process.env.APP_NAME || "MyApp"}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendOtpEmail };


