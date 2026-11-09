const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required']
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        }
    },
    { timestamps: true }
);

// A student can only be enrolled in a given course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
// Speeds up "list students in a course" and cascading deletes by course
enrollmentSchema.index({ course: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);