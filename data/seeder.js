const {seedUsers} = require("./seed_users");
const {seedProducts} = require("./seed_products");

async function seedDb() {
    await seedUsers();
    await seedProducts();
}

module.exports = {seedDb}