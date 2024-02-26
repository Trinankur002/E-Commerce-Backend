const mongoose = require('mongoose');
const { Category } = require('./category.model');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String, default: '' }],
    price : {type : Number, required : true},
    countInStock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    richDescription: { type: String, default: '' },
    brand: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number, min: 0 },
    isFeatured: Boolean,
    createdAt: { type: Date, default: Date.now },
});

exports.Product = mongoose.model('Product', productSchema);
