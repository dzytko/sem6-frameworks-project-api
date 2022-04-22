const {Order} = require('../models/order');
const {User} = require("../models/user");
const {Product} = require("../models/product");

async function seedOrders() {
    const ordersPerUser = 2;
    const orderItemsInOrder = 3;

    const testUser = await User.findOne({email: 'a@a.com'})
    const anotherUser = await User.findOne({email: 'another@another.com'})

    const products = await Product.find({})

    await Order.deleteMany({});
    const orders = []
    for (let i = 0; i < ordersPerUser * 2; i++) {
        let orderItems = []
        let totalAmount = 0
        for (let j = i; j < i + orderItemsInOrder; j++) {
            let quantity = Math.floor(Math.random() * 10) + 1
            orderItems.push({
                productId: products[i + j]._id,
                quantity: quantity,
            })
            totalAmount += products[i + j].unitPrice * quantity
        }
        orders.push({
            userId: i >= ordersPerUser ? testUser: anotherUser,
            orderDate: Date.now() + i,
            totalAmount: totalAmount,
            deliveryMethod: `deliveryMethod${i}`,
            paymentMethod: `paymentMethod${i}`,
            firstName: `firstName${i}`,
            lastName: `lastName${i}`,
            email: `${i}mail@mail.com`,
            street: `street${i}`,
            postalCode: `postalCode${i}`,
            city: `city${i}`,
            phoneNumber: `phoneNumber${i}`,
            orderItems: orderItems
        });
    }

    await Order.insertMany(orders);
}

module.exports = {seedOrders};