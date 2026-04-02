import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    mpin: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 100000.00, // Starting balance
    },
    savingsJar: {
        type: Number,
        default: 0.00,
    },
    trustedContacts: [
        {
            phone: String,
            name: String,
            isConfirmed: { type: Boolean, default: false }
        }
    ],
    safeZones: [
        {
            name: String,
            lat: Number,
            lng: Number,
            radius: { type: Number, default: 5000 } // meters
        }
    ],
    settings: {
        isFamilyModeEnabled: { type: Boolean, default: false },
        isGeoFenceEnabled: { type: Boolean, default: false },
        isRoundUpEnabled: { type: Boolean, default: false }
    },
    isVerifiedMerchant: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Hash the MPIN before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('mpin')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.mpin = await bcrypt.hash(this.mpin, salt);
});

// Method to verify MPIN
userSchema.methods.matchMpin = async function(enteredMpin) {
    return await bcrypt.compare(enteredMpin, this.mpin);
};

const User = mongoose.model('User', userSchema);

export default User;
