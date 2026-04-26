import {nodemailer} from 'nodemailer';
import { useState } from 'react';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const otpStore = function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}



export function sendEmailOTP(email, otp) {
    return(
        "create otp"
    )
}

export function verifyEmailOTP(email, otp) {
    return(
        "verified otp"
    )
}