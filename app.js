require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const fs = require("fs");
const path = require("path");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const connection = require('./database')
const {seedDb} = require('./data/seeder')
connection()

const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const productsRouter = require('./routes/products')
const categoryRouter = require('./routes/categories')
const cartItemRouter = require('./routes/cart_items')
const orderRouter = require('./routes/orders')
const app = express()

if (process.env.NODE_ENV === 'development') {
    seedDb().then()
    const swaggerOptions = {
        customCss: fs.readFileSync(path.join(__dirname, 'swaggerDark.css'), 'utf8'),
        swaggerOptions: {
            operationsSorter: (a, b) => {
                const methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
                let result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));
                if (result === 0) {
                    result = a.get("path").localeCompare(b.get("path"));
                }
                return result;
            }
        }
    }
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))
}

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/user', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/product', productsRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart-item', cartItemRouter)
app.use('/api/order', orderRouter)

module.exports = app
