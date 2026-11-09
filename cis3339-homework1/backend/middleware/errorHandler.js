const DUPLICATE_MESSAGES = {
    studentId: 'A student with that ID already exists',
    courseId: 'A course with that ID already exists',
    'student,course': 'This student is already enrolled in this course'
};

function errorHandler(err, req, res, next) {
    // Malformed JSON body
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Request body is not valid JSON' });
    }

    // Schema validation (required fields, ZIP format, etc.)
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: details.join('. '), details });
    }

    // Wrong data type for a field
    if (err.name === 'CastError') {
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
    }

    // Unique index violation
    if (err.code === 11000) {
        const key = Object.keys(err.keyPattern || {}).sort().join(',');
        return res.status(409).json({
            error: DUPLICATE_MESSAGES[key] || 'Duplicate record'
        });
    }

    // MongoDB unreachable
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
        return res.status(503).json({ error: 'Database is unavailable' });
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;