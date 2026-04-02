import express from 'express';
import { registerWithGoogle, loginPhone, loginVerifyMpin, verifyMpin } from './auth.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google-register', registerWithGoogle);
router.post('/login-phone', loginPhone);
router.post('/login-verify-mpin', loginVerifyMpin);
router.post('/verify-mpin', protect, verifyMpin);

export default router;
