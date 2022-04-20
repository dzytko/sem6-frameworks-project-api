const {seedUsers} = require("./seed_users");
const {seedProducts} = require("./seed_products");
const {seedCategories} = require("./seed_categories");
const {seedCartItems} = require("./seed_cart_items");

async function seedDb() {
    await seedUsers()
    await seedProducts()
    await seedCategories()
    await seedCartItems()
}

module.exports = {seedDb}