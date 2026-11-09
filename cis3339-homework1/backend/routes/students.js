const express = require('express');
const { Student, Enrollment } = require('../models');
const { validateObjectIdParam, escapeRegex } = require('../utils/objectId');

const router = express.Router();
router.param('id', validateObjectIdParam);

// GET /api/students?search=jo  -> all students, or filter by name / student ID
router.get('/', async (req, res) => {
    const filter = {};
    const search = String(req.query.search ?? '').trim();
    if (search) {
        const pattern = { $regex: escapeRegex(search), $options: 'i' };
        filter.$or = [{ name: pattern }, { studentId: pattern }];
    }
    const students = await Student.find(filter).sort({ name: 1 });
    res.json(students);
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
});

// POST /api/students
router.post('/', async (req, res) => {
    const { name, studentId, phone, zip } = req.body ?? {};
    const student = await Student.create({ name, studentId, phone, zip });
    res.status(201).json(student);
});

// DELETE /api/students/:id  (also removes this student's enrollments)
router.delete('/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { deletedCount } = await Enrollment.deleteMany({ student: student._id });
    await student.deleteOne();

    res.json({
        message: 'Student deleted',
        student,
        enrollmentsRemoved: deletedCount
    });
});

module.exports = router;