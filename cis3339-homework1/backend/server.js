const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./models'); // register Student, Course, Enrollment

const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// REST API
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Unknown API routes return JSON instead of an HTML page
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Serve the Vue production build (created by `npm run build`)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const indexFile = path.join(distPath, 'index.html');
app.use(express.static(distPath));

// Fallback so refreshing a Vue Router page (e.g. /students) loads the app
// instead of returning 404. Requests for missing files (.js, .css...) still 404.
app.use((req, res, next) => {
    if (req.method !== 'GET' || path.extname(req.path)) return next();
    if (!fs.existsSync(indexFile)) {
        return res
            .status(503)
            .send('Frontend not built. Run "npm run build" first.');
    }
    res.sendFile(indexFile);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
        console.error('Is MongoDB running? Check MONGODB_URI in backend/.env');
        process.exit(1);
    });