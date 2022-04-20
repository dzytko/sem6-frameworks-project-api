const {Product} = require("../models/product");


const productCount = 30;

const discountedPercentage = 0.2;
const discontinuedPercentage = 0.3;

const priceMin = 5.0;
const priceMax = 100.0;

async function seedProducts() {
    await Product.deleteMany({});
    const products = []

    for (let i = 1; i <= productCount; i++) {
        const price = Math.floor((Math.random() * (priceMax - priceMin + 1) + priceMin) * 100) / 100;
        const discount = Math.random() * 0.5 + 0.1;
        products.push({
            productName: `Product ${i}`,
            categoryId: null,
            unitPrice: price,
            isDiscounted: Math.random() < discountedPercentage,
            isDiscontinued: Math.random() < discontinuedPercentage,
            discountedUnitPrice: Math.floor(price * (1 - discount) * 100) / 100,
            properties: {prop1: `prop1 ${i}`, prop2: `prop2 ${i}`},
            imagePath: `/images/product${i}.jpg`,
            quantity: Math.floor(Math.random() * 100) + 1
        });
    }

    await Product.insertMany(products)
}

module.exports = {seedProducts}