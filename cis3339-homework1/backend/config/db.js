const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined. Check backend/.env');
    }

    // Fail fast (5s) with a clear error if MongoDB isn't running
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);

    // Wait until every model's indexes (including unique ones) are built
    await Promise.all(
        Object.values(mongoose.models).map((model) => model.init())
    );
    console.log('Database indexes ready');
}

module.exports = connectDB;