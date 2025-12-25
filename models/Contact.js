const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    from_name: {
        type: String,
        required: true,
        trim: true
    },
    from_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    project_type: {
        type: String,
        required: true
    },
    budget: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
