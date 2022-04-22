const {seedUsers} = require("./seed_users");
const {seedProducts} = require("./seed_products");
const {seedCategories} = require("./seed_categories");
const {seedCartItems} = require("./seed_cart_items");
const {seedOrders} = require("./seed_orders");

async function seedDb() {
    await seedUsers()
    await seedProducts()
    await seedCategories()
    await seedCartItems()
    await seedOrders()
}

module.exports = {seedDb}