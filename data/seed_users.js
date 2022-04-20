const bcrypt = require("bcrypt");
const {User} = require("../models/user");

async function seedUsers() {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    const anyHashed = await bcrypt.hash("any", salt)

    new User({
            firstName: "firstName",
            lastName: "lastName",
            email: "a@a.com",
            password: anyHashed
        }
    ).save()
}

module.exports = {seedUsers}