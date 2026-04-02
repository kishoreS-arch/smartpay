import express from 'express';
import { sendMoney, getTransactions, getBalance, checkRisk } from './banking.controller.js';
import { updateSettings, addTrustedContact } from './settings.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-money', protect, sendMoney);
router.post('/check-risk', protect, checkRisk);
router.get('/transactions', protect, getTransactions);
router.get('/balance', protect, getBalance);
router.patch('/settings', protect, updateSettings);
router.post('/trusted-contacts', protect, addTrustedContact);

export default router;
