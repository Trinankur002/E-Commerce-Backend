const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    // id: String,
    apartment : String,
    street: String,
    city: String,
    zip: String,
    country: String,
    phone: String, 
})
// addressSchema.virtual('id').get(() => this._id.toHexString());
// addressSchema.set('toJSON', { virtuals: true })
exports.Address= mongoose.model('Address', addressSchema)