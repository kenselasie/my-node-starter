import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"
import morgan from "morgan"
import productRoutes  from './api/routes/products.js'
import orderRoutes  from './api/routes/orders.js'
import userRoutes  from './api/routes/user.js'

const app = express()

// if (process.env.NODE_ENV !== 'production') {
dotenv.config()
// }

//Database connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/node-rest-db', { useNewUrlParser: true, useUnifiedTopology: true }, )
.then(() => console.log('You are now connected to the node-rest-db Database!'))
.catch(err => console.error('Something went wrong connecting to the database', err))

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use(cors())
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

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
