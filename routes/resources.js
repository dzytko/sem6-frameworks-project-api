const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/image/:name', (req, res) => {
    // #swagger.tags = ["Resource"]
    // #swagger.summary = "Get image by name"
    const imagePath = path.resolve(`${__dirname}/../public/images/${req.params.name}`)
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found')
    }
    res.sendFile(imagePath)
})

module.exports = router