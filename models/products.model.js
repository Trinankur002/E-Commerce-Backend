const mongoose = require('mongoose');
const { Category } = require('./category.model');
const { json } = require('body-parser');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true, minlength: 3 },
    image: { type: String, required: true },
    images: [{ type: String, default: '' }],
    price : {type : Number, required : true},
    countInStock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    richDescription: { type: String, default: '' },
    brand: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number, min: 0 },
    isFeatured: { type :Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// productSchema.virtual('id').get(function ({ return this._id.toHexString()}))
// productSchema.virtual('id').get(() => this._id.toHexString());
// productSchema.set('toJSON', {virtuals : true})

exports.Product = mongoose.model('Product', productSchema);
