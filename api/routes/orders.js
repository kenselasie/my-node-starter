import express from 'express'

import Order from '../models/orderModel.js'
import { getAllOrders } from '../controllers/ordersController.js'
import Product from '../models/productModel.js'
import checkAuth from '../middleware/check-auth.js'

const router = express.Router()

router.get('/', checkAuth, (req, res) => {
    return getAllOrders(req, res)
})

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            res.status(404).json({
                message: 'No product with that id',
            })
        }
        const order = new Order({
            product: req.body.productId,
            quantity: req.body.quantity
        })
    
        return order.save()       
    }).then(order => {
        console.log({
            message: 'POST /orders',
            order
        })
        res.status(201).json({
            message: 'Order successfully created',
            order
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })

})

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product', 'name')
    .exec()
    .then(order => {
        if(!order) {
            res.status(404).json({
                message: 'No such order'       
            })
        } else {
            console.log({
                message: 'GET /order by Id',
                order
            })

            res.status(200).json({
                order       
            })
        }
    }).catch(err => {
        res.status(500).json({
            err       
        })
    })
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
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

export default router