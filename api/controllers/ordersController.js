import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'


const getAllOrders = async (req, res) => {
    try {
        let orders = await Order.find({})
            .populate('product', 'name')
            .select('product quantity _id')
        if (orders) {
            res.status(200).json({
                message: 'Orders successfully fetched',
                orders
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { order_id } = req.params
        let order = await Order.findById(order_id).populate('product', 'name')
        if (!order) return res.status(404).json({ message: 'No such order' })

        return res.status(200).json({
            message: 'Success',
            data: order
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}

const addOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: 'No order with that id',
            })
        }
        const order = new Order({
            product: productId,
            quantity: quantity
        })
        await order.save()
        res.status(201).json({
            message: 'Order successfully created',
            order
        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const deleteOrderById = async (req, res) => {
    try {
        const { order_id } = req.params

        let order = await Order.findById(order_id)
        if (!order) return res.status(404).json({
            message: 'No order with that id exits to be deleted'
        })

        let remove = await Order.remove({ _id: order_id })
        if (!remove) return res.status(404).json({ message: 'No order with that id' })

        return res.status(200).json({
            message: 'Order Deleted!'
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
}


export { getAllOrders, getOrderById, deleteOrderById, addOrder }