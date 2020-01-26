const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/orderModel')
const Product = require('../models/productModel')

router.get('/', (req, res, next) => {
    Order.find()
    .populate('product', 'name')
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            message: 'Orders successfully fetched',
            docs
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            res.status(404).json({
                message: 'No product with that id',
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        })
    
        return order.save()       
    }).then(result => {
        res.status(201).json({
            message: 'Order successfully created',
            order: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })

})

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId).exec()
    .then(order => {
        if(!order) {
        res.status(404).json({
            message: 'No such order'       
        })
        }
        res.status(200).json({
            order       
        })
    }).catch(err => {
        res.status(500).json({
            err       
        })
    })
})

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
    .then(order => {
        res.status(200).json({
            message: 'Order Deleted!'       
        })
    }).catch(err => {
        res.status(500).json({
            err       
        })
    })
})

module.exports = router