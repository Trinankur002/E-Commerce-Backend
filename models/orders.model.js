const mongoose = require('mongoose');
const OrderedItemsSchema = require('./orderedItems.model');
const AddressSchema = require('./address.model');
const UserSchema = require('./user.model');

const orderSchema = new mongoose.Schema({
    orderedItems: {type: OrderedItemsSchema, required: true},
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: {type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled']},
    totalPrice: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    dateOrdered: { type: Date, default: Date.now },
});
// orderSchema.virtual('id').get(() => this._id.toHexString());
// orderSchema.set('toJSON', { virtuals: true })
module.exports = mongoose.model('Orders', orderSchema);
