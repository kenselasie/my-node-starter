const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)

    } else {
        cb(new Error('Must be a png or jpeg file'), false)
    }
}
 
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require('../models/productModel')

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec().then(docs => {
        console.log(docs)
        res.status(200).json({
            message: 'All Products',
            Products: docs
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    
})

router.post('/', upload.single('productImage'),(req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Successfully posted data',
            createdProduct: product
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc)
        if (doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({
                message: 'Does not exist in the database'
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Product.update({_id: id}, {$set:  updateOps }).exec().then(result => {
        res.status(200).json({
            message: 'Product updated succesfully'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id}).exec().then(result => {
        res.status(200).json({
                message: 'Successfully deleted'
            }
        )
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router