const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true, unique: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false},
    unitPrice: {type: Number, required: true},
    isDiscounted: {type: Boolean, required: true},
    isDiscontinued: {type: Boolean, required: true},
    discountedUnitPrice: {type: Number, required: false},
    properties: {type: mongoose.Schema.Types.Map, required: false},
    imagePath: {type: String, required: false},
    quantity: {type: Number, required: true},
})

const Product = mongoose.model("Product", productSchema)

module.exports = {Product}