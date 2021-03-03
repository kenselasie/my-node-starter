import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', //Connect this schema to the product model
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
})

export default mongoose.model('Order', orderSchema)