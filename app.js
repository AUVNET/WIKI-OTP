require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // optional, to increase connection timeout
    greetingTimeout: 5000,    // optional, to increase greeting timeout
});

// Route to handle receiving OTP and sending it via email
app.post('/send-otp', async (req, res) => {
    const { email, otp } = req.body;
    
    // Check if both email and otp are provided
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        // Send email with the provided OTP
        await transporter.sendMail({
            from: `"WIKI-WIKI Support" <${process.env.SMTP_USER}>`, // sender address
            to: email,
            subject: 'Your WIKI-WIKI OTP Code – Secure Account Access', // Subject line
            html: `
                <p>Hello,</p>
                
                <p>To complete your login or verify your account on <strong>WIKI-WIKI</strong>, please use the One-Time Password (OTP) provided below. This code helps ensure the security of your account and will expire shortly.</p>
                
                <p><strong>Your OTP Code:</strong> <span style="font-size: 18px;"><strong>${otp}</strong></span></p>
        
                <p>Please note:</p>
                <ul>
                    <li>This OTP is valid for <strong>10 minutes</strong>.</li>
                    <li><strong>Do not share</strong> this code with anyone. WIKI-WIKI will never ask for this code outside of this secure message.</li>
                </ul>
        
                <p>If you did not request an OTP, please ignore this email or contact our support team for assistance.</p>
                
                <p>Thank you for choosing WIKI-WIKI! We're here to ensure your experience is safe and seamless.</p>
                
                <p>Warm regards,<br>
                The WIKI-WIKI Team</p>
        
                <hr>
                <p><em>Note: This is an automated message. Please do not reply directly to this email.</em></p>
            `,
        });        
        console.log('OTP sent successfully');
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
