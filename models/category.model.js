const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    // id: String,
    name: String,
    color: String,
    icon: String,
    image : String
})
exports.Category = mongoose.model('Category', categorySchema)
