const express = require('express')
require('dotenv/config')
const { Product } = require('../models/products.model')
const router = express.Router()

router.get(`/`, async (req, res) => {
    const productList = await Product.find()
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.get(`/namedescrionimage/`, async (req, res) => {
    const productList = await Product.find().select('name image description -_id')
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.post(`/`, async (req, res) => {
    let product = await new Product({
        name: req.body.name,
        image: req.body.image,
        images: req.body.images,
        price: req.body.price,
        countInStock: req.body.countInStock,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        category: req.body.category,
        rating: req.body.rating,
        isFeatured : req.body.isFeatured,
    })

    if (!product) { return res.status(400).send('product cannot be read or empty category') }
    product = await product.save()
    res.send(product)
})

router.get(`/find/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.put(`/:id`, async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            images: req.body.images,
            price: req.body.price,
            countInStock: req.body.countInStock,
            description: req.body.description,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            category: req.body.category,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            updatedAt: Date.now(),
        }, { new: true })
    if (!product) { return res.status(400).send('product cannot be read or empty category') }
    res.send(product)
})

router.delete(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(500).json({ success: false })
    }
    await Product.findOneAndDelete(req.params.id)
    res.send('product deleted successfully')
})


module.exports = router