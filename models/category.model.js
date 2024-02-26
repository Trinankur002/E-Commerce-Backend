const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true, minlength: 3 },
    color: { type: String },
    icon: { type: String, default : 'icon' },
    image: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

exports.Category = mongoose.model('Category', categorySchema);
