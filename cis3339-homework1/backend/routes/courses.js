const express = require('express');
const { Course, Enrollment } = require('../models');
const { validateObjectIdParam } = require('../utils/objectId');

const router = express.Router();
router.param('id', validateObjectIdParam);

// GET /api/courses
router.get('/', async (req, res) => {
    const courses = await Course.find().sort({ courseId: 1 });
    res.json(courses);
});

// POST /api/courses
router.post('/', async (req, res) => {
    const { courseId, name } = req.body ?? {};
    const course = await Course.create({ courseId, name });
    res.status(201).json(course);
});

// GET /api/courses/:id/students  -> roster of enrolled students
router.get('/:id/students', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const enrollments = await Enrollment.find({ course: course._id }).populate('student');
    const students = enrollments
        .map((e) => e.student)
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ course, students });
});

// DELETE /api/courses/:id  (also removes this course's enrollments)
router.delete('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { deletedCount } = await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({
        message: 'Course deleted',
        course,
        enrollmentsRemoved: deletedCount
    });
});

module.exports = router;