const {seedUsers} = require("./seed_users");
const {seedProducts} = require("./seed_products");
const {seedCategories} = require("./seed_categories");

async function seedDb() {
    await seedUsers();
    await seedProducts();
    await seedCategories()
}

module.exports = {seedDb}