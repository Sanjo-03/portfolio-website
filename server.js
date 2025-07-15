const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g., index.html)

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact Form Endpoint
app.post('/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message, newsletter } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sanjosunny2003@gmail.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                Name: ${firstName} ${lastName}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
                Newsletter Subscription: ${newsletter ? 'Yes' : 'No'}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));