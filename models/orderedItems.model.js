const mongoose = require('mongoose')
const { Product } = require('./products.model')

const orderedItemsSchema = mongoose.Schema({
    // id: String,
    product: Product,
    quantity : Number,
})
exports.OrderedItems = mongoose.model('OrderedItems', orderedItemsSchema)