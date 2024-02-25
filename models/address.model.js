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
exports.Address= mongoose.model('Address', addressSchema)