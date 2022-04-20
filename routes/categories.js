const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.get('/', async (req, res) => {
    // #swagger.parameters['parent-id'] = {in: 'query'}
    // #swagger.summary = 'Get all categories optionally filtered by parent id'
    // #swagger.tags = ["category"]
    let filters = {};
    if (req.query['parent-id']) {
        filters = {parentId: req.query['parent-id']};
    }
    Category.find({...filters}).sort('categoryName').exec((err, categories) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
            return
        }
        res.send(categories)
    })
});

router.get('/:id', async (req, res) => {
    // #swagger.tags = ["category"]
    // #swagger.summary = 'Get category by id'
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
            return
        }
        if (!category) {
            res.status(404).send("Category not found")
            return
        }
        res.send(category)
    })
});

module.exports = router;