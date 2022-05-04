const express = require('express')
const router = express.Router()
const {Product} = require('../models/product')
const {authenticate} = require('../middleware/authenticate')
const parseRange = require('range-parser')

router.get('/', (req, res) => {
    // #swagger.tags = ["Product"]
    // #swagger.summary = "Get all products"
    // #swagger.parameters['sort-by'] = {in: 'query'}
    // #swagger.parameters['order-by'] = {in: 'query'}
    // #swagger.description = "Get all products in range passed by range header (both sides inclusive), sorted by sort-by query param, ordered by order-by param"
    // #swagger.response.206.description = "Partial content"
    const sortBy = req.query['sort-by'] ?? 'productId'
    const sortOrder = req.query['sort-order'] ?? 'asc'

    Product.find({}).sort({sortBy: sortOrder}).exec((err, products) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Internal server error')
        }

        let range = parseRange(products.length, req.headers.range ?? '')
        if (req.headers.range && range === -1) {
            return res.status(416).send('Range not satisfiable')
        }
        else if (req.headers.range && range === -2) {
            return res.status(400).send('Malformed range header string')
        }

        if (range < 0) {
            range = [{start: 0, end: products.length - 1}]
        }

        const productsToSend = products.slice(range[0].start, range[0].end + 1)

        res.set('Content-Range', `products ${range[0].start}-${range[0].start + productsToSend.length - 1}/${products.length}`)
        res.status(productsToSend.length === products.length ? 200 : 206).send(productsToSend)
    })
})

router.get('/:id', (req, res) => {
    // #swagger.tags = ["Product"]
    // #swagger.summary = "Get product by id"

    Product.findById(req.params.id, (err, product) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        if (!product) {
            res.status(404).send('Product not found')
            return
        }
        res.send(product)
    })
})

router.patch('/:id', authenticate, (req, res) => {
    // #swagger.tags = ["Product"]
    // #swagger.summary = "Update product by id"
    // #swagger.parameters["body"] = {in: "body", schema: {productName: "any", categoryId: "any", unitPrice: "any", isDiscounted: "any", isDiscontinued: "any", discountedUnitPrice: "any", properties: "any", imagePath: "any", quantity: "any"}}
    Product.findByIdAndUpdate(req.params.id, req.body, (err, product) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        if (!product) {
            res.status(404).send('Product not found')
            return
        }
        res.send(product)
    })
})

module.exports = router