import Product from '../models/productModel.js'
import _ from 'lodash';

const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({})
            .select('name price _id productImage')
        if (products) {
            res.status(200).json({
                message: 'All Products',
                products
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const getSingleProductById = async (req, res) => {
    try {
        const id = req.params.id
        let product = await Product.findById(id)
            .select('name price _id productImage')

        return res.status(200).json(product)
    }
    catch (err) {
        res.status(500).json({
            message: 'Does not exist in the database',
            error: err
        })
    }
}

const addProduct = async (req, res) => {
    try {
        console.log(req.file)
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        })

        let result = await product.save()
        if (result) {
            return res.status(201).json({
                message: 'Successfully posted data',
                createdProduct: product
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['name', 'price', 'productImage'])

    try {
        let result = await Product.updateMany({ _id: id }, { $set: body }, { new: true })
        if (!result) return res.status(500).json({ message: 'Something bad occurred updating'  })
        
        return res.status(200).json({
            message: 'Product updated succesfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.productId
        let result = await Product.remove({ _id: id })
        if(!result) return res.status(500).json({ message: 'Something bad occurred deleting'  })

        return res.status(200).json({
            message: 'Successfully deleted'
        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


export { getAllProducts, addProduct, getSingleProductById, updateProduct, deleteProduct }