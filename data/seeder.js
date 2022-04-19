const {User} = require("../models/user");
const bcrypt = require("bcrypt");


async function seedDb() {
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

module.exports = {seedDb}