const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.get('/', async (req, res) => {
    // #swagger.tags = ["Category"]
    // #swagger.summary = 'Get all categories optionally filtered by parent id'
    // #swagger.parameters['parent-id'] = {in: 'query'}

    let filters = {};
    if (req.query['parent-id'] === 'null') {
        filters = {parentId: null};
    }
    else if (req.query['parent-id']) {
        filters = {parentId: req.query['parent-id']};
    }

    Category.find({...filters}).sort('categoryName').exec((err, categories) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
        return res.send(categories)
    })
});

router.get('/:id', async (req, res) => {
    // #swagger.tags = ["Category"]
    // #swagger.summary = 'Get category by id'
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Internal server error")
        }
        if (!category) {
            return res.status(404).send("Category not found")
        }
        return res.send(category)
    })
});

module.exports = router;