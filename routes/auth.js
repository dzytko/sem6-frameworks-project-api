const authRouter = require("express").Router()
const {User} = require("../models/user")
const bcrypt = require("bcrypt")
const joi = require("joi")

authRouter.post("/", async (req, res) => {
    // #swagger.tags = ["Auth"]
    // #swagger.summary = "Login user"
    try {
        const {error} = validate(req.body);
        if (error){
            return res.status(400).send({message: error.details[0].message})
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(401).send({message: "Invalid email or password"})
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword){
            return res.status(401).send({message: "Invalid email or password"})
        }

        const jwt = user.generateAuthToken();
        res.status(200).send({jwt: jwt, message: "Success"})
    } catch (error) {
        res.status(500).send({message: "Internal server error"})
    }
})

const validate = (data) => {
    const schema = joi.object({
        email: joi.string().email().required().label("Email"),
        password: joi.string().required().label("Password")
    })
    return schema.validate(data)
}

module.exports = authRouter