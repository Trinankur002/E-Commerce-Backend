const mongoose = require('mongoose');
const OrderedItemsSchema = require('./orderedItems.model');
const AddressSchema = require('./address.model');
const UserSchema = require('./user.model');

const orderSchema = new mongoose.Schema({
    orderedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderedItems', required: true }],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: {type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'], default: 'pending'},
    totalPrice: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    dateOrdered: { type: Date, default: Date.now },
});

exports.Orders = mongoose.model('Orders', orderSchema);
