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
    try {
        const { from_name, from_email, project_type, budget, message } = req.body;

        // 1. Save to Database
        const newContact = new Contact({ from_name, from_email, project_type, budget, message });
        await newContact.save();

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

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: 'Message saved and email sent!' });
    } catch (error) {
        console.error('Error in contact route:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
