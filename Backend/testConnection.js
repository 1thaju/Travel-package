require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_package');
        console.log('Successfully connected to MongoDB.');
        
        // Test creating a document
        const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await Test.create({ name: 'test' });
        console.log('Successfully created test document.');
        
        // Clean up
        await mongoose.connection.dropCollection('tests');
        console.log('Successfully cleaned up test collection.');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

testConnection(); 