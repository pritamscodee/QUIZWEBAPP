import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { validateUsername, validatePassword, isValidEmail } from '../utils/validationHelper.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: v => validateUsername(v).isValid
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: { validator: isValidEmail, message: 'Invalid email format' }
    },
    password: {
        type: String,
        required: true,
        validate: v => validatePassword(v).isValid
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        totalQuizzesTaken: this.totalQuizzesTaken,
        totalScore: this.totalScore,
        createdAt: this.createdAt
    };
};

export default mongoose.model('User', userSchema);