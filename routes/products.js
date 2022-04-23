const express = require('express')
const router = express.Router()
const {Product} = require('../models/product')
const {authenticate} = require('../middleware/authenticate')

// TODO: test the shit out of this router

router.get('/', (req, res) => {
    // #swagger.tags = ["Product"]
    // #swagger.summary = "Get all products"
    Product.find({}).sort('productName').exec((err, products) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.send(products)
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