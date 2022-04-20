const {CartItem} = require('../models/cart_item');
const {User} = require('../models/user');
const {Product} = require("../models/product");

async function seedCartItems() {
    await CartItem.deleteMany({})
    const products = await Product.find({})
    const testUser = await User.findOne({email: 'a@a.com'})
    const anotherUser = await User.findOne({email: 'another@another.com'})
    const cartItems = []

    for (let i = 0; i < Math.min(products.length, 5); i++) {
        cartItems.push({
            userId: testUser._id,
            productId: products[i]._id,
            quantity: Math.floor(Math.random() * 10) + 1
        })
    }
    for (let i = 0; i < Math.min(products.length, 5); i++) {
        cartItems.push({
            userId: anotherUser._id,
            productId: products[i]._id,
            quantity: Math.floor(Math.random() * 10) + 1
        })
    }

    await CartItem.insertMany(cartItems)
}

module.exports = {seedCartItems}