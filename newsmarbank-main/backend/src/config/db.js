import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartbank_dev';
        console.log(`📡 Attempting MongoDB Connection...`);
        
        // Timeout after 5 seconds instead of crashing
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ Warning: MongoDB connection failed (${error.message}).`);
        console.log(`ℹ️ SmartPay API will run without persistency for demo purposes.`);
    }
};

export { connectDB };
export default connectDB;
