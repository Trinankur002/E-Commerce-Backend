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

router.get(`/find/:id`, async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400).json({ success: false , message: 'category with the ID not found'})
    }
    res.status(200).send(category)
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

router.put(`/:id`, async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
    {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
        updatedAt: Date.now(),
    }, {new : true})
    if (!category) { return res.status(400).send('category cannot be read or empty category') }
    res.send(category)
})


router.delete(`/:id`,(req, res) => {
    Category.findByIdAndDelete(req.params.id).then(category => {
        if (category) { return res.status(200).json({ success: true, message: 'the category is removed' }) }
        else { return res.status(404).json({ success: false, message: 'category of that id not found' }) }
    }).catch(err => { return res.send(400).json({ success: false, error: err }) })
})

module.exports = router