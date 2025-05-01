const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/travel-package';

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MongoDB URI:', MONGODB_URI);

        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected Successfully! ✅');
        
        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log('Connected to database:', dbName);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.name === 'MongoServerError') {
            console.log('\nMake sure MongoDB is running on your machine');
            console.log('Try running: mongod');
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }
        process.exit(0);
    }
};

testConnection(); 