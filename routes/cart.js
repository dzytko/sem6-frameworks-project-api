const express = require("express");
const router = express.Router()
const {CartItem} = require("../models/cart_item")
const {authenticate} = require("../middleware/authenticate");

router.use(authenticate)

router.get("/", (req, res) => {
    // #swagger.tags = ["Cart"]
    // #swagger.summary = "Get all cart items"
    CartItem.find({userId: req.user._id})
        .then((cartItems) => {
            res.send(cartItems)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

router.post("/", (req, res) => {
    // #swagger.tags = ["Cart"]
    // #swagger.summary = "Add a new cart item"
    const cartItem = new CartItem({
        userId: req.user._id,
        productId: req.body.productId,
        quantity: req.body.quantity
    })
    cartItem.save()
        .then((cartItem) => {
            res.send(cartItem)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

router.patch("/:id", (req, res) => {
    // #swagger.tags = ["Cart"]
    // #swagger.summary = "Update a cart item"
    CartItem.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true})
        .then((cartItem) => {
            res.send(cartItem)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

router.delete("/:id", (req, res) => {
    // #swagger.tags = ["Cart"]
    // #swagger.summary = "Delete a cart item"
    CartItem.findOneAndRemove({_id: req.params.id})
        .then((cartItem) => {
            res.send(cartItem)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

router.delete("/", (req, res) => {
    // #swagger.tags = ["Cart"]
    // #swagger.summary = "Delete all cart items"
    CartItem.remove({userId: req.user._id})
        .then((cartItems) => {
            res.send(cartItems)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

module.exports = router