const express = require('express')
const { Category } = require('../models/category.model')
require('dotenv/config')
const router = express.Router()

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(500).json({success: false})
    }
    res.send(categoryList)
})

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon, 
        image: req.body.image,
    })
    category = await category.save()

    if (!category) { return res.status(400).send('category cannot be read or empty category') }
    res.send(category)
})
module.exports = router