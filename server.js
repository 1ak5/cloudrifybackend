const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files (this will handle index.html automatically)
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact Model
const contactSchema = new mongoose.Schema({
    from_name: { type: String, required: true },
    from_email: { type: String, required: true },
    project_type: { type: String, required: true },
    budget: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// API Routes
app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);
    try {
        const { from_name, from_email, project_type, budget, message } = req.body;

        if (!from_name || !from_email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        // 1. Save to Database
        const newContact = new Contact({ from_name, from_email, project_type, budget, message });
        await newContact.save();
        console.log('Contact saved to database successfully.');

        // 2. Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `New Contact Form Submission from ${from_name}`,
            text: `
                You have a new submission from your website:
                
                Name: ${from_name}
                Email: ${from_email}
                Project Type: ${project_type}
                Budget: ${budget}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${from_name}</p>
                <p><strong>Email:</strong> ${from_email}</p>
                <p><strong>Project Type:</strong> ${project_type}</p>
                <p><strong>Budget:</strong> ${budget}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
            res.status(201).json({ success: true, message: 'Message saved and email sent!' });
        } catch (mailError) {
            console.error('Nodemailer Error:', mailError);
            // Even if email fails, data is saved in DB. 
            // We tell the user it's saved but mention the email issue in terminal.
            res.status(201).json({ success: true, message: 'Message saved (but email failed to send)' });
        }
    } catch (error) {
        console.error('Database/Server Error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
