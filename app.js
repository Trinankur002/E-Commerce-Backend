const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('dotenv/config')
const mongoose = require('mongoose')
const cors = require('cors')
const productsRouter = require('./routes/products.routes')
const categoriesRouter = require('./routes/categories.routes')
const orderRouter = require('./routes/orders.routes')
const userRouter = require('./routes/user.routes')
const authJwt = require('./helper/jwt')

// middlewares
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json())
app.use(morgan('tiny'))

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({ message: err })
    }
})


const api = process.env.API_URL
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/orders`, orderRouter)
app.use(`${api}/user`, userRouter)

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log('database connected')
}).catch((err) => {
    console.log('cannot connect to database')
})

app.get(api+'/', (req, res) => {
    res.send('server running ')
})

app.listen(3003, () => {
    console.log(`server running on http://localhost:3003${api} !` )
})