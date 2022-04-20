const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router()
const {User, validateUser} = require("../models/user")
const {authenticate} = require("../middleware/authenticate");

router.get('/', authenticate, (req, res) => {
    // #swagger.tags = ["user"]
    // #swagger.summary = "Get all users"
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
        } else {
            res.send(users)
        }
    });
});

router.post('/', async (req, res) => {
    // #swagger.tags = ["user"]
    // #swagger.summary = "Create new user"
    try {
        const {error} = validateUser(req.body)
        if (error){
            return res.status(400).send({message: error.details[0].message})
        }

        const user = await User.findOne({email: req.body.email})
        if (user){
            return res.status(409).send({message: "User with this email already exists"})
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword}).save()

        res.status(201).send({message: "User created"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Internal server error"})
    }
})

router.delete('/:id', authenticate, (req, res) => {
    // #swagger.tags = ["user"]
    // #swagger.summary = "Delete user"
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: "Internal server error"})
        } else {
            res.send(user)
        }
    })
});

module.exports = router