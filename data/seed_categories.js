const {Category} = require('../models/category');

async function seedCategories() {
    await Category.deleteMany({});
    const categories = [
        {
            _id: "00112233445566778899aabb",
            categoryName: "category1",
            parentId: null,
        },
        {
            _id: "00112233445566778899aabc",
            categoryName: "category2",
            parentId: "00112233445566778899aabb",
        },
        {
            _id: "00112233445566778899aabd",
            categoryName: "category3",
            parentId: "00112233445566778899aabb",
        },
        {
            _id: "00112233445566778899aabe",
            categoryName: "category31",
            parentId: "00112233445566778899aabd",
        },
        {
            _id: "00112233445566778899aabf",
            categoryName: "category32",
            parentId: "00112233445566778899aabd",
        },
        {
            _id: "00112233445566778899aaa0",
            categoryName: "category321",
            parentId: "00112233445566778899aabf",
        },
    ]
    await Category.insertMany(categories);
}

module.exports = {seedCategories};