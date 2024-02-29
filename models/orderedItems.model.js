const mongoose = require('mongoose')
const orderedItemsSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
})
exports.OrderedItems = mongoose.model('OrderedItems', orderedItemsSchema)