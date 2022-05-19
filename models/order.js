const mongoose = require('mongoose')
const joi = require('joi')

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderDate: {type: Date, default: Date.now},
    totalAmount: {type: Number, required: true},
    deliveryMethod: {type: String, required: true},
    paymentMethod: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    street: {type: String, required: true},
    postalCode: {type: String, required: true},
    city: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    orderItems: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, required: true},
    }],
})

const Order = mongoose.model('Order', orderSchema)

const validateOrder = (data) => {
    const schema = joi.object({
        userId: joi.string().hex().length(24).label('User Id'),
        orderDate: joi.date().less('now').label('Order Date'),
        totalAmount: joi.number().greater(0).label('Total Amount'),
        deliveryMethod: joi.string().required().label('Delivery Method'),
        paymentMethod: joi.string().required().label('Payment Method'),
        firstName: joi.string().required().label('First Name'),
        lastName: joi.string().required().label('Last Name'),
        email: joi.string().required().email().label('Email'),
        street: joi.string().required().label('Street'),
        postalCode: joi.string().required().label('Postal Code'),
        city: joi.string().required().label('City'),
        phoneNumber: joi.string().required().label('Phone Number'),
        orderItems: joi.array().items(joi.object({
            productId: joi.string().hex().length(24).required().label('Product Id'),
            quantity: joi.number().greater(0).required().label('Quantity'),
        })).required().label('Order Items'),
    }).unknown(true)
    return schema.validate(data)
}

module.exports = {Order, validateOrder}