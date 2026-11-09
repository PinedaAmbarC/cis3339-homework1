const express = require('express');
const { Student, Course, Enrollment } = require('../models');
const { isObjectId } = require('../utils/objectId');

const router = express.Router();

// GET /api/enrollments
router.get('/', async (req, res) => {
    const enrollments = await Enrollment.find()
        .populate('student')
        .populate('course')
        .sort({ createdAt: -1 });
    res.json(enrollments);
});

// POST /api/enrollments   body: { "student": "<student _id>", "course": "<course _id>" }
router.post('/', async (req, res) => {
    const { student, course } = req.body ?? {};
    if (!isObjectId(student) || !isObjectId(course)) {
        return res.status(400).json({ error: 'A valid student and course are required' });
    }

    const [studentExists, courseExists] = await Promise.all([
        Student.exists({ _id: student }),
        Course.exists({ _id: course })
    ]);
    if (!studentExists) return res.status(404).json({ error: 'Student not found' });
    if (!courseExists) return res.status(404).json({ error: 'Course not found' });

    // The unique (student, course) index rejects duplicates -> 409 via errorHandler
    const enrollment = await Enrollment.create({ student, course });
    await enrollment.populate(['student', 'course']);

    res.status(201).json(enrollment);
});

module.exports = router;