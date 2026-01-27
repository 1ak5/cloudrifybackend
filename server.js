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
    project_type: { type: String },
    budget: { type: String },
    message: { type: String, required: true },
    metadata: { type: Object }, // To store extra fields like form_type and subject
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// API Routes
app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);
    try {
        const { form_type, from_name, from_email, project_type, subject, message } = req.body;

        if (!from_name || !from_email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        // 1. Save to Database
        // We'll store both in the same collection, but include the type
        const contactData = {
            from_name,
            from_email,
            project_type: project_type || 'Support Request',
            budget: 'N/A', // Removed from UI
            message,
            metadata: { form_type: form_type || 'enquiry', subject: subject || 'No Subject' }
        };
        const newContact = new Contact(contactData);
        await newContact.save();
        console.log('Contact saved to database successfully.');

        // 2. Determine Recipient (Connected to .env EMAIL_1 and EMAIL_2)
        const isSupport = form_type === 'support';
        const recipient = isSupport ? process.env.EMAIL_2 : process.env.EMAIL_1;
        const mailSubject = isSupport ? `Support Request: ${subject || 'Help Needed'}` : `New Enquiry: ${project_type}`;

        // 3. Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: mailSubject,
            text: `
                You have a new ${isSupport ? 'Support Request' : 'Client Enquiry'}:
                
                Name: ${from_name}
                Email: ${from_email}
                ${isSupport ? `Subject: ${subject}` : `Project Type: ${project_type}`}
                Message: ${message}
            `,
            html: `
                <h3>New ${isSupport ? 'Support Request' : 'Client Enquiry'}</h3>
                <p><strong>Name:</strong> ${from_name}</p>
                <p><strong>Email:</strong> ${from_email}</p>
                <p><strong>${isSupport ? 'Subject' : 'Project Type'}:</strong> ${isSupport ? subject : project_type}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(201).json({ success: true, message: 'Sent Successfully!' });
        } catch (mailError) {
            console.error('Nodemailer Error:', mailError);
            res.status(201).json({ success: true, message: 'Saved (Email Error)' });
        }
    } catch (error) {
        console.error('Database/Server Error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
