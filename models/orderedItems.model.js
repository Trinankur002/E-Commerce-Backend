const mongoose = require('mongoose')
const { Product } = require('./products.model')

const orderedItemsSchema = mongoose.Schema({
    // id: String,
    product: Product,
    quantity : Number,
})
// orderedItemsSchema.virtual('id').get(() => this._id.toHexString());
// orderedItemsSchema.set('toJSON', { virtuals: true })
exports.OrderedItems = mongoose.model('OrderedItems', orderedItemsSchema)