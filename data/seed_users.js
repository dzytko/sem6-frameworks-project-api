const bcrypt = require("bcrypt");
const {User} = require("../models/user");

async function seedUsers() {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    const anyHashed = await bcrypt.hash("any", salt)

    new User({
            _id: "6261ace02e0cf1d3db5c5fad",
            firstName: "firstName",
            lastName: "lastName",
            email: "a@a.com",
            password: anyHashed
        }
    ).save()
    new User({
            _id: "6261ace02e0cf1d3db5c5fae",
            firstName: "another",
            lastName: "lastName",
            email: "another@another.com",
            password: anyHashed
        }
    ).save()
}

module.exports = {seedUsers}