import express from 'express'
import multer from 'multer'
import checkAuth from '../middleware/check-auth.js'
import { getAllProducts, addProduct, getSingleProductById, updateProduct, deleteProduct } from '../controllers/productsController.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
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

router.post('/', checkAuth, upload.single('productImage'), (req, res) => {
    return addProduct(req, res)
})

router.get('/:id', checkAuth, (req, res, next) => {
    return getSingleProductById(req, res)
})

router.patch('/:id', checkAuth, (req, res, next) => {
    return updateProduct(req, res)
})

router.delete('/:id', checkAuth, (req, res, next) => {
    return deleteProduct(req, res)
})

export default router