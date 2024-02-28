const express = require('express');
const { Orders } = require('../models/orders.model');
const { OrderedItems } = require('../models/orderedItems.model');
const { Address } = require('../models/address.model');
const { default: mongoose } = require('mongoose');
require('dotenv/config')
const router = express.Router()

router.get(`/:id?`, async (req, res) => {
    try {
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

router.post('/', async (req, res) => {
    try {
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
        const order = new Orders({
            address: address._id,
            user: req.body.user,
            orderedItems: orderedItems,
            totalPrice: req.body.totalPrice,
        });
        await order.save();
        const createdOrder = await Orders.findById(order.id)
            .populate('address')
            .populate('user')  
            .populate('orderedItems');
        return res.status(201).json({ success: true, message: 'Order created successfully', order: createdOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const orders = await Orders.findById(req.params.id)
        if (!orders) {
            res.status(500).json({ success: false })
        }
        await Orders.findOneAndDelete(req.params.id)
        res.send('orders deleted successfully')
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

module.exports = router