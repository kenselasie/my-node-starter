import express from 'express'
import multer from 'multer'
import checkAuth from '../middleware/check-auth.js'
import { getAllProducts, addProduct, getSingleProductById } from '../controllers/productsController.js'
import Product from '../models/productModel.js'

const router = express.Router()

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


router.get('/', (req, res) => {
   return getAllProducts(req, res)
})

router.post('/',checkAuth, upload.single('productImage'), (req, res) => {
    return addProduct(req, res)
})

router.get('/:id',checkAuth, (req, res, next) => {
    return getSingleProductById(req, res)
})

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete('/:productId', checkAuth, (req, res, next) => {
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

export default router