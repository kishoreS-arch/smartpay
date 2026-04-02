import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Initialize Database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 SmartPay API Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});
