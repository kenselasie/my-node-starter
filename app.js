const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Database connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/node-rest-db', { useNewUrlParser: true, useUnifiedTopology: true }, )
.then(() => console.log('You are now connected to the node-rest-db Database!'))
.catch(err => console.error('Something went wrong connecting to the database', err))

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, () =>{
    console.log(`App is listening on port ${port}!`)
})

// module.exports = app