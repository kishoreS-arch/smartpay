import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

import authRoutes from './modules/auth/auth.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import bankingRoutes from './modules/banking/banking.routes.js';

// ... (other imports)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/banking', bankingRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', msg: 'SmartPay API is running' });
});

export default app;
