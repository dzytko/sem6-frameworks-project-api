const express = require('express')
const router = express.Router()
const {authenticate} = require('../middleware/authenticate')
const {CartItem, validateCartItem} = require('../models/cart_item')
const {Product} = require('../models/product')

router.use(authenticate)

router.get('/', (req, res) => {
    // #swagger.tags = ["CartItem"]
    // #swagger.summary = "Get all cart items"
    CartItem.find({userId: req.user._id}, (err, cartItems) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.send(cartItems)
    })
})

router.post('/', async (req, res) => {
    // #swagger.tags = ["CartItem"]
    // #swagger.summary = "Add a new cart item"
    const {error} = validateCartItem(req.body)
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }

    const product = await Product.findOne({_id: req.body.productId})
    if (!product) {
        res.status(400).send('Product not found')
        return
    }

    const cartItem = await CartItem.findOne({userId: req.user._id, productId: req.body.productId})
    if (cartItem) {
        res.status(409).send('Product already in cart')
        return
    }

    new CartItem({
        userId: req.user._id,
        productId: req.body.productId,
        quantity: req.body.quantity,
    }).save((err, cartItem) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.status(201).send(cartItem)
    })
})

router.patch('/:id', async (req, res) => {
    // #swagger.tags = ["CartItem"]
    // #swagger.summary = "Update a cart item"
    const cartItem = await CartItem.findOne({_id: req.params.id, userId: req.user._id})
    if (!cartItem) {
        res.status(404).send('Cart item not found')
        return
    }
    if (req.body.productId) {
        cartItem.productId = req.body.productId
    }
    if (req.body.quantity) {
        cartItem.quantity = req.body.quantity
    }

    const {error} = validateCartItem({productId: cartItem.productId.toString(), quantity: cartItem.quantity})
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }

    const product = await Product.findOne({_id: cartItem.productId})
    if (!product) {
        res.status(400).send('Product not found')
        return
    }
    const cartItemDuplicate = await CartItem.findOne({userId: req.user._id, productId: req.body.productId})
    if (cartItemDuplicate && cartItemDuplicate._id.toString() !== cartItem._id.toString()) {
        res.status(409).send('Cart item for that product already exists')
        return
    }

    CartItem.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, {$set: cartItem}, {new: true}, (err, cartItem) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.send(cartItem)
    })
})

router.delete('/:id', async (req, res) => {
    // #swagger.tags = ["CartItem"]
    // #swagger.summary = "Delete a cart item"
    const cartItem = await CartItem.findOne({_id: req.params.id, userId: req.user._id})
    if (!cartItem) {
        res.status(404).send('Cart item not found')
        return
    }
    CartItem.findOneAndRemove({_id: req.params.id, userId: req.user._id}, (err, cartItem) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.send(cartItem)
    })
})

router.delete('/', (req, res) => {
    // #swagger.tags = ["CartItem"]
    // #swagger.summary = "Delete all cart items"
    CartItem.remove({userId: req.user._id}, (err, cartItem) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.send(cartItem)
    })
})

module.exports = router