const express = require('express');
const { Orders } = require('../models/orders.model');
const { OrderedItems } = require('../models/orderedItems.model');
const { Address } = require('../models/address.model');
const { default: mongoose } = require('mongoose');
const authenticateToken = require('../helper/jwt');
const { User } = require('../models/user.model');
require('dotenv/config')
const router = express.Router()

router.get(`/:id?`, authenticateToken,  async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (req.params.id) {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid ID');
            }
            const orders = await Orders.findById(req.params.id)
                .populate('address')
                .populate('user')
                .populate({ path: 'orderedItems', populate: { path: 'product', populate :'category' } });
            if (!orders) {
                return res.status(404).json({ success: false, message: 'Order with that ID not found' });
            }
            return res.send(orders);
        }
        const orderList = await Orders.find()
            .populate('address')
            .populate('user')
            .populate({ path: 'orderedItems', populate :'product' })
            .sort('dateOrdered');
        if (!orderList || orderList.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }
        return res.send(orderList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/', authenticateToken ,async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.userId)) {
            return res.status(400).send('Invalid ID');
        }
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User with that ID not found' });
        }
        const address = new Address({
            apartment: req.body.address.apartment,
            street: req.body.address.street,
            city: req.body.address.city,
            zip: req.body.address.zip,
            country: req.body.address.country,
            phone: req.body.address.phone,
        });
        await address.save();
        const orderedItemsPromises = req.body.orderedItems.map(async (orderedItem) => {
            const newOrderItem = new OrderedItems({
                product: orderedItem.product,
                quantity: orderedItem.quantity,
            });
            await newOrderItem.save();
            return newOrderItem._id;
        });
        const orderedItems = await Promise.all(orderedItemsPromises);
        const totalPrices = await Promise.all(orderedItems.map(async (orderedItemId) => {
            const orderedItem = await OrderedItems.findById(orderedItemId).populate('product', 'price');
            return orderedItem.product.price * orderedItem.quantity;
        }));
        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
        const order = new Orders({
            address: address._id,
            user: req.userId,
            orderedItems: orderedItems,
            totalPrice: totalPrice,
        });
        await order.save();
        const createdOrder = await Orders.findById(order.id)
            .populate({ path: 'orderedItems', populate: { path: 'product', populate: 'category' } })
            .populate('address')
            .populate('user');
        return res.status(201).json({ success: true, message: 'Order created successfully', order: createdOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.delete(`/:id`, authenticateToken, async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid ID');
        }
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        await Address.findByIdAndDelete(order.address);
        await OrderedItems.deleteMany({ _id: { $in: order.orderedItems } });
        await Orders.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Order and associated items deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.isAdmin) { return res.status(401).json({ success: false, message: 'Admin permission not allowed' }) }
        if (!mongoose.isValidObjectId(req.params.id)) { return res.status(400).send('Invalid ID') }
        const orders = await Orders.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        }, { new: true })
        res.status(200).json({ success: true, message: 'Order updated successfully', order : orders })
        if (!orders) {
            res.status(500).json({ success: false, message: 'Order id not found'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
module.exports = router