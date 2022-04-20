const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true, unique: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, required: true}, // TODO add ref
    unitPrice: {type: Number, required: true},
    isDiscounted: {type: Boolean, required: true},
    isDiscontinued: {type: Boolean, required: true},
    discountedUnitPrice: {type: Number, required: true},
    properties: {type: mongoose.Schema.Types.Map, required: true},
    imagePath: {type: String, required: true},
    quantity: {type: Number, required: true},
})

const Product = mongoose.model("Product", productSchema)

module.exports = {Product}