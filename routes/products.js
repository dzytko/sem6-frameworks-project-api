const express = require('express')
const router = express.Router()
const {Product} = require('../models/product')
const {authenticate} = require('../middleware/authenticate')
const parseRange = require('range-parser')

router.get('/', async (req, res) => {
    // #swagger.tags = ["Product"]
    // #swagger.summary = "Get all products"
    // #swagger.parameters['sort-by'] = {in: 'query'}
    // #swagger.parameters['order-by'] = {in: 'query'}
    // #swagger.parameters['category-id'] = {in: 'query'}
    // #swagger.description = "Get all products belonging to category-id query param in range passed by range header (both sides inclusive), sorted by sort-by query param, ordered by order-by param"
    const sortBy = req.query['sort-by'] ?? 'productName'
    const sortOrder = req.query['sort-order'] ?? 'asc'
    const categoryId = req.query['category-id']

    let filters = {isDiscontinued: false}

    if (categoryId) {
        filters['categoryId'] = categoryId
    }

    const totalProducts = await Product.countDocuments({...filters}).exec()
    let range = parseRange(totalProducts, req.headers.range ?? '')
    if (!req.headers.range) {
        range = [{start: 0, end: totalProducts - 1}]
    }
    else if (range === -1) {
        return res.status(416).send('Range not satisfiable')
    }
    else if (range === -2) {
        return res.status(400).send('Malformed range header string')
    }

    Product
        .find({...filters})
        .skip(range[0].start)
        .limit(range[0].end - range[0].start + 1)
        .sort({sortBy: sortOrder})
        .exec((err, products) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Internal server error')
            }

            if (sortBy === 'price') {
                products.sort((left, right) => {
                    const leftPrice = left.isDiscounted ? left.discountedUnitPrice : left.unitPrice
                    const rightPrice = right.isDiscounted ? right.discountedUnitPrice : right.unitPrice
                    if (sortOrder === 'asc') {
                        return leftPrice - rightPrice
                    }
                    else {
                        return rightPrice - leftPrice
                    }
                })
            }


            res.set('Content-Range', `products=${range[0].start}-${range[0].end}/${totalProducts}`)
            res.status(totalProducts === products.length ? 200 : 206).send(products)
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