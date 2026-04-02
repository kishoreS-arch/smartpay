import jwt from 'jsonwebtoken';
import User from '../modules/auth/auth.model.js';
import mongoose from 'mongoose';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartbank_secret');
            
            if (mongoose.connection.readyState === 1) {
                req.user = await User.findById(decoded.id).select('-mpin');
            } else {
                // Mock user object for demo mode
                req.user = { id: decoded.id };
            }
            
            if (!req.user) {
                 return res.status(401).json({ message: 'User not found' });
            }
            
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
