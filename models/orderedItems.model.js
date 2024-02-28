const mongoose = require('mongoose')
const { Product } = require('./products.model')

const orderedItemsSchema = mongoose.Schema({
    // id: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
})
exports.OrderedItems = mongoose.model('OrderedItems', orderedItemsSchema)