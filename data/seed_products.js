const {Product} = require("../models/product");

async function seedProducts() {
    await Product.deleteMany({});
    const products = [
        {
            productName: "product1",
            categoryId: "625f560428df23a0e44042e1",
            unitPrice: 11.11,
            isDiscounted: false,
            isDiscontinued: false,
            discountedUnitPrice: 1.11,
            properties: {},
            imagePath: "image1.jpg",
            quantity: 5,
        },
        {
            productName: "product2",
            categoryId: "625f560428df23a0e44042e1",
            unitPrice: 22.22,
            isDiscounted: false,
            isDiscontinued: false,
            discountedUnitPrice: 2.22,
            properties: {},
            imagePath: "image2.jpg",
            quantity: 5,
        },
        {
            productName: "product3",
            categoryId: "625f560428df23a0e44042e1",
            unitPrice: 33.33,
            isDiscounted: false,
            isDiscontinued: false,
            discountedUnitPrice: 3.33,
            properties: {prop1: "value1", prop2: "value2"},
            imagePath: "image3.jpg",
            quantity: 5,
        },
    ]
    await Product.insertMany(products)
}

module.exports = {seedProducts}