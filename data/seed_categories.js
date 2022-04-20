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
            categoryName: "category2",
            parentId: "00112233445566778899aabb",
        },
        {
            categoryName: "category3",
            parentId: "00112233445566778899aabb",
        },
    ]
    await Category.insertMany(categories);
}

module.exports = {seedCategories};