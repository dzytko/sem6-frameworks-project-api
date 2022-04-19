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
const app = express();

if (process.env.NODE_ENV === 'development') {
    seedDb().then()
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('api/users', usersRouter);
app.use('api/auth', authRouter);

module.exports = app;
