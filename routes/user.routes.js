const express = require('express');
const { User } = require('../models/user.model');
const { Address } = require('../models/address.model'); 
require('dotenv/config');
const mongoose = require('mongoose')
const router = express.Router();
const bcrypt = require('bcrypt')

router.get(`/:id?`, async (req, res) => {
    try {
        if (req.params.id) {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid ID');
            }
            const user = await User.findById(req.params.id).select('-passwordHash').populate('address');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User with that ID not found' });
            }
            return res.send(user);
        }
        const userList = await User.find().select('-passwordHash').populate('address');
        if (!userList || userList.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }
        return res.send(userList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



router.post('/', async (req, res) => {
    try {
        // let address = null;
        if (req.body.address) {
            address = new Address({
                apartment: req.body.address.apartment,
                street: req.body.address.street,
                city: req.body.address.city,
                zip: req.body.address.zip,
                country: req.body.address.country,
                phone: req.body.address.phone,
            });
            await address.save();
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password, process.env.PASSWORD_HASH ),
                phone: req.body.phone,
                address: address._id,
            });
            await user.save();
        }

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            // address: address._id || null, 
        });

        await user.save();
        return res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid ID');
        }
        if (req.body.address) {
            const addressId = req.body.address.id;
            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                {
                    apartment: req.body.address.apartment,
                    street: req.body.address.street,
                    city: req.body.address.city,
                    zip: req.body.address.zip,
                    country: req.body.address.country,
                    phone: req.body.address.phone,
                },
                { new: true, upsert: true }
            );
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    phone: req.body.phone,
                    address: updatedAddress._id,
                },
                { new: true }
            );
            if (!user) {
                return res.status(400).send('User not found or cannot be updated');
            }
            return res.status(200).json({ success: true, user });
        } else {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    phone: req.body.phone,
                },
                { new: true }
            );
            if (!user) {
                return res.status(400).send('User not found or cannot be updated');
            }
            return res.status(200).json({ success: true, user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) { res.status(400).send('Invalid ID') }
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(500).json({ success: false })
        }
        await User.findOneAndDelete(req.params.id)
        res.send('user deleted successfully')
    } catch (error) {
        console.error(error); // Log the error for investigation
        return await res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

module.exports = router;
