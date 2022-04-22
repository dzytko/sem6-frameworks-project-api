const mongoose = require('mongoose');
const joi = require("joi");

const cartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const CartItem = mongoose.model('CartItem', cartItemSchema)

const validateCartItem = (data) => {
    const schema = joi.object({
        productId: joi.string().hex().length(24).required().label('Product Id'),
        quantity: joi.number().greater(0).required().label('Quantity')
    })
    return schema.validate(data)
}

module.exports = {CartItem, validateCartItem}