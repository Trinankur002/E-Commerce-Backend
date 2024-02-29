const express = require('express')
require('dotenv/config')
const mongoose = require('mongoose')
const { Product } = require('../models/products.model')
const {Category} = require('../models/category.model')
const authenticateToken = require('../helper/jwt')
const multer = require('multer')
const router = express.Router()

const FILE_TYPES = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFile = FILE_TYPES[file.mimetype];
        if (!isValidFile) {
            const error = new Error('Invalid file type');
            return cb(error, 'public/uploads');
        }
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(/\s+/g, '-');
        const extension = FILE_TYPES[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    }
});
const upload = multer({ storage: storage })

router.get(`/`, async (req, res) => {
    try {
        let filter = {}
        if (req.query.category) {
            filter= {category : req.query.category.split(',')}
        }
        const productList = await Product.find(filter).populate('category')
        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList)
    } catch (error) {
        console.error(error);  
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get(`/get/featured/:count?`, async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 1
        const productList = await Product.find({isFeatured: true}).limit(+count)
        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList)
    } catch (error) {
        console.error(error);  
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get(`/namedescrionimage/`, async (req, res) => {
    try {
        const productList = await Product.find().select('name image description -_id')
        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList)
    } catch (error) {
        console.error(error);
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.post(`/`, authenticateToken, upload.single('image'),upload.array('images', 10),  async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return await res.status(400).json({ success: false, message: 'Category with the ID not found' });
            }
        }
        const files = req.files
        let imagespath =[]
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        const filename = req.file.filename
        if (files && files.length > 0) {
            files.forEach(file => {
                imagespath.push(`${basePath}${file.filename}`);
            });
        }
        let product = await new Product({
            name: req.body.name,
            image: `${basePath}${filename}`,
            images: imagespath,
            price: req.body.price,
            countInStock: req.body.countInStock,
            description: req.body.description,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            category: req.body.category,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        })
        if (!product) { return res.status(400).send('product cannot be read or empty category') }
        product = await product.save()
        res.send(product)
    } catch (error) {
        console.error(error);  
        return await res.status(500).json({ success: false, message: 'Error saving product' });
    }
})

router.get(`/find/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const product = await Product.findById(req.params.id).populate('category')
        if (!product) {
            res.status(500).json({ success: false })
        }
        res.send(product)
    } catch (error) {
        console.error(error);  
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.put(`/:id`, authenticateToken, upload.single('image'), upload.array('images', 10), async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const category = await Category.findById(req.body.category);
        if (!category) {
            return await res.status(400).json({ success: false, message: 'Category with the ID not found' });
        }
        const files = req.files
        let imagespath = []
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        const filename = req.file.filename
        if (files && files.length > 0) {
            files.forEach(file => {
                imagespath.push(`${basePath}${file.filename}`);
            });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                image: `${basePath}${filename}`,
                images: imagespath,
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
        if (!product) { return await res.status(400).send('product cannot be read or empty category') }
        res.send(product)
    } catch (error) {
        console.error(error);
        return await res.status(500).json({ success: false, message: 'Error saving product' });
    }
})

router.delete(`/:id`, authenticateToken, async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID')}
        const product = await Product.findById(req.params.id)
        if (!product) {
            res.status(500).json({ success: false })
        }
        await Product.findOneAndDelete(req.params.id)
        res.send('product deleted successfully')
    } catch (error) {
        console.error(error);  
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})
module.exports = router