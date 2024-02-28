const express = require('express')
const mongoose = require('mongoose')
const { Category } = require('../models/category.model')
require('dotenv/config')
const router = express.Router()

router.get(`/`, async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            res.status(500).json({ success: false })
        }
        res.send(categoryList)
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get(`/find/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(400).json({ success: false, message: 'category with the ID not found' })
        }
        res.status(200).send(category)
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.post(`/`, async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon,
            image: req.body.image,
        })
        category = await category.save()

        if (!category) { return res.status(400).send('category cannot be read or empty category') }
        res.send(category)
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.put(`/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                color: req.body.color,
                icon: req.body.icon,
                image: req.body.image,
                updatedAt: Date.now(),
            }, { new: true })
        if (!category) { return res.status(400).send('category cannot be read or empty category') }
        res.send(category)
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.delete(`/:id`,async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        Category.findByIdAndDelete(req.params.id).then(category => {
            if (category) { return res.status(200).json({ success: true, message: 'the category is removed' }) }
            else { return res.status(404).json({ success: false, message: 'category of that id not found' }) }
        })
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

module.exports = router