import Order from '../models/orderModel.js'


const getAllOrders = async (req, res) => {
    try {
        let orders = await Order.find({})
            .populate('product', 'name')
            .select('product quantity _id')
        console.log(orders)
        if (orders) {
            res.status(200).json({
                message: 'Orders successfully fetched',
                orders
            })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}


export { getAllOrders }