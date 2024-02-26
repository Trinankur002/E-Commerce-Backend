const mongoose = require('mongoose');
const OrderedItemsSchema = require('./orderedItems.model');
const AddressSchema = require('./address.model');
const UserSchema = require('./user.model');

const orderSchema = new mongoose.Schema({
    orderedItems: {type: OrderedItemsSchema, required: true},
    address: {type: AddressSchema, required: true},
    status: {type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled']},
    totalPrice: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    dateOrdered: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Orders', orderSchema);
