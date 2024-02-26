const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id will be a MongoDB ObjectId by default
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,  /*Ensure unique emails*/
        lowercase: true,  /*Normalize email to lowercase*/
        validate: {
            validator: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
passwordHash: { type: String, required: true, /* Consider using a password hashing library for proper security*/},
    phone: { type: String, /*Optional validation for phone numbers*/},
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now},
});

userSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        // Implement proper password hashing here
        // Example: this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
    next();
});

exports.User = mongoose.model('User', userSchema);
