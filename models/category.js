const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    categoryName: {type: String, required: true, unique: true},
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
})

const Category = mongoose.model("Category", categorySchema)

module.exports = {Category}