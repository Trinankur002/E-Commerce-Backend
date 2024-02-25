const mongoose = require('mongoose')
const { OrderedItems } = require('./orderedItems.model')
const { Address } = require('./address.model')
const {User} = require('./user.model')

const orderSchema = mongoose.Schema({
    // id: String,
    orderedItems: OrderedItems,
    address: Address,
    status: String,
    totalPrice: Number,
    user: User,
    dateOrdered: Date,
})
exports.Orders = mongoose.model('Orders', orderSchema)