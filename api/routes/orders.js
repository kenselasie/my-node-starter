import express from 'express'

import { getAllOrders, addOrder, getOrderById, deleteOrderById } from '../controllers/ordersController.js'
import checkAuth from '../middleware/check-auth.js'

const router = express.Router()

router.get('/',  (req, res) => {
    return getAllOrders(req, res)
})

router.post('/',  (req, res) => {
    return addOrder(req, res)
})

router.get('/:order_id',  (req, res) => {
    return getOrderById(req, res)
})

router.delete('/:order_id',  (req, res) => {
    return deleteOrderById(req, res)
})

export default router