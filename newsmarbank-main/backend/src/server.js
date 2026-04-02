import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    // Try MongoDB, fallback to local-db.json automatically
    try {
        await connectDB();
    } catch (err) {
        console.log('MongoDB unavailable, using local JSON database (demo mode).');
    }

    app.listen(PORT, () => {
        console.log(`\n🚀 SmartPay API running at http://localhost:${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/health\n`);
    });
};

startServer();
