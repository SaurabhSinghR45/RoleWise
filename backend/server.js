require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Connect to Database and start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`[Rolewise] Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`[Rolewise] Failed to start server:`, error);
        process.exit(1);
    }
};

startServer();
