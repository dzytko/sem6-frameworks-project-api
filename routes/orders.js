const express = require("express");
const router = express.Router()
const {authenticate} = require("../middleware/authenticate");
const {Order, validateOrder} = require("../models/order")
const {Product} = require("../models/product");

router.use(authenticate)

router.get("/", (req, res) => {
    // #swagger.tags = ["Order"]
    // #swagger.summary = "Get all orders"
    Order.find({userId: req.user._id}, (err, orders) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
        return res.send(orders)
    })
})

router.get("/:id", (req, res) => {
    // #swagger.tags = ["Order"]
    // #swagger.summary = "Get order by id"
    Order.findOne({_id: req.params.id, userId: req.user._id}, (err, order) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
        if (!order) {
            return res.status(404).send("Order not found")
        }
        return res.send(order)
    })
})

router.post("/", async (req, res) => {
    // #swagger.tags = ["Order"]
    // #swagger.summary = "Create order"
    if (!req.body.orderItems || !req.body.orderItems.length) {
        return res.status(400).send("No items in order")
    }
    const {error} = validateOrder(req.body)
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }
    let totalAmount = 0
    for (const orderItem of req.body.orderItems) {
        const product = await Product.findOne({_id: orderItem.productId})
        if (!product) {
            return res.status(400).send(`Product with id ${orderItem.productId} does not exist`)
        }
        if (product.quantity < orderItem.quantity) {
            return res.status(400).send(`Not enough products with id ${orderItem.productId}`)
        }
        totalAmount += orderItem.quantity * product.unitPrice
    }

    const newOrder = new Order({
        userId: req.user._id,
        orderDate: req.body.orderDate,
        totalAmount: totalAmount,
        deliveryMethod: req.body.deliveryMethod,
        paymentMethod: req.body.paymentMethod,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        street: req.body.street,
        postalCode: req.body.postalCode,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
        orderItems: req.body.orderItems
    })

    const order = await Order.findOne({userId: req.user._id, orderDate: req.body.orderDate})
    if (order) {
        return res.status(400).send("Order already exists")
    }

    newOrder.save((err, order) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
        return res.status(201).send(order)
    })
})

module.exports = router