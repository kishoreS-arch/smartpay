import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const LOCAL_DB_PATH = path.resolve('local-db.json');

const getLocalDb = () => {
    if (!fs.existsSync(LOCAL_DB_PATH)) return {};
    try {
        return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    } catch (e) {
        return {};
    }
};

const saveToLocalDb = (data) => {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
};

const isDbConnected = () => mongoose.connection.readyState === 1;

export const updateSettings = async (req, res) => {
    const { settings } = req.body;
    const userId = req.user.id;

    try {
        if (!isDbConnected()) {
            const phone = userId.startsWith("demo_") ? userId.replace("demo_", "") : "USER";
            const db = getLocalDb();
            const user = db[phone];
            
            if (user) {
                user.settings = { ...user.settings, ...settings };
                db[phone] = user;
                saveToLocalDb(db);
                return res.json({ success: true, settings: user.settings });
            }
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTrustedContact = async (req, res) => {
    const { contact } = req.body;
    const userId = req.user.id;
    try {
        if (!isDbConnected()) {
            const phone = userId.startsWith("demo_") ? userId.replace("demo_", "") : "USER";
            const db = getLocalDb();
            const user = db[phone];
            if (user) {
                if (!user.trustedContacts) user.trustedContacts = [];
                user.trustedContacts.push({ ...contact, isConfirmed: true });
                db[phone] = user;
                saveToLocalDb(db);
                return res.json({ success: true, trustedContacts: user.trustedContacts });
            }
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};
