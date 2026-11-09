const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        zip: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true,
            match: [/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits (or ZIP+4)']
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);