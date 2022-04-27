const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const {User, validateUser} = require('../models/user')
const {authenticate} = require('../middleware/authenticate')

router.get('/', authenticate, (req, res) => {
    // #swagger.tags = ["User"]
    // #swagger.summary = "Get current user"
    User.findOne({_id: req.user._id}, (err, users) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
        }
        else {
            res.send(users)
        }
    })
})

router.post('/', async (req, res) => {
    // #swagger.tags = ["User"]
    // #swagger.summary = "Create new user"
    const {error} = validateUser(req.body)
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }

    const user = await User.findOne({email: req.body.email})
    if (user) {
        return res.status(409).send({message: 'User with this email already exists'})
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
    }).save((err, user) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
            return
        }
        res.status(201).send({message: 'User created', user: user})
    })
})

router.patch('/', authenticate, async (req, res) => {
    // #swagger.tags = ["User"]
    // #swagger.summary = "Update current user"

    if (req.user.email && req.user.email !== req.body.email) {
        const user = await User.findOne({email: req.user.email, _id: {$ne: req.user._id}})
        if (user) {
            return res.status(409).send({message: 'User with this email already exists'})
        }
    }

    const user = await User.findOne({_id: req.user._id})
    if (!user) {
        return res.status(404).send('User not found')
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send({message: 'Invalid password'})
    }

    if (!user) {
        return
    }

    user.firstName = req.body.firstName ?? user.firstName
    user.lastName = req.body.lastName ?? user.lastName
    user.email = req.body.email ?? user.email
    const oldPasswordHashed = user.password
    user.password = req.body.newPassword ?? 'StrongDummyPassword420#'

    const {error} = validateUser(user)
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }

    if (req.body.newPassword) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        user.password = await bcrypt.hash(req.body.newPassword, salt)
    }
    else {
        user.password = oldPasswordHashed
    }

    await user.save((err, user) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Internal server error')
        }
        res.send({
            message: 'User updated', user:
                {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
        })
    })
})

router.delete('/', authenticate, (req, res) => {
    // #swagger.tags = ["User"]
    // #swagger.summary = "Delete current user"
    User.findByIdAndDelete(req.user._id, (err, user) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: 'Internal server error'})
            return
        }
        res.send(user)
    })
})

module.exports = router