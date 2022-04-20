require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connection = require('./database')
const {seedDb} = require('./data/seeder')
connection()

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');

const app = express();

if (process.env.NODE_ENV === 'development') {
    seedDb().then()
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/user', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productsRouter);
app.use('/api/category', categoryRouter);

module.exports = app;
