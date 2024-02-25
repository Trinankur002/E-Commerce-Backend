// const mongoose = require('mongoose')
// const { Category } = require('./category.model')

// const productSchema = mongoose.Schema({
//     name: String,
//     image: String,
//     countInStock: {
//         type: Number,
//         required: true
//     },
//     description: String,
//     richDescription: String,
//     // images: String[image],
//     brand: String,
//     category: Category,
//     rating: Number,
//     isFeatured: Boolean,
//     dateCreated : Date,
// })
// exports.Product = mongoose.model('Product', productSchema)

const mongoose = require('mongoose');
const { Category } = require('./category.model');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/yourDatabaseName')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: String,
    countInStock: { type: Number, required: true, min: 0 }, // Ensure non-negative count
    description: String,
    richDescription: String,
    brand: String,
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    // category: Category,
    rating: Number,
    isFeatured: Boolean,
    createdAt: { type: Date, default: Date.now }, // Use createdAt for consistency
});

exports.Product = mongoose.model('Product', productSchema);
