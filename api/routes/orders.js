import express from 'express'

import { getAllOrders, addOrder, getOrderById, deleteOrderById } from '../controllers/ordersController.js'
import checkAuth from '../middleware/check-auth.js'

const router = express.Router()

router.get('/', checkAuth, (req, res) => {
    return getAllOrders(req, res)
})

router.post('/', checkAuth, (req, res) => {
    return addOrder(req, res)
})

router.get('/:order_id', checkAuth, (req, res) => {
    return getOrderById(req, res)
})

router.delete('/:order_id', checkAuth, (req, res) => {
    return deleteOrderById(req, res)
})

export default router