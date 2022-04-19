const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['app.js']
const config = {
    host: 'localhost:3000',
    basePath: '/',
    info: {
        title: 'Shop API',
        description: 'Shop API Documentation',
        version: '1.0.0'
    },
}

swaggerAutogen(outputFile, endpointsFiles, config);