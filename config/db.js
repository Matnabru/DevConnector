// MongoDB connection
const mongoose = require('mongoose');
const config = require('config');
// Get value from config
const db = config.get('mongoURI');

// It is cleaner to use it as async
//mongoose.connect(db);

// Async arrow function
const connectDB = async () => {
    // We need way to fetch case of connection problems
    try{
        console.log()
        await mongoose.connect(db);

        console.log('MongoDB Connected...')
    }catch(err){
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

// Export module
module.exports = connectDB;