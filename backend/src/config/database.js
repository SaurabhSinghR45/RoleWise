const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas / Local MongoDB instance
 */
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rolewise";
        const conn = await mongoose.connect(uri);
        console.log(`[Rolewise] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Rolewise] MongoDB Connection Error: ${error.message}`);
        console.error(`[Rolewise] Please ensure MONGODB_URI is set in backend/.env`);
        process.exit(1);
    }
};

module.exports = connectDB;
