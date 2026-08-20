const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas / Local MongoDB instance
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[Rolewise] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Rolewise] MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
