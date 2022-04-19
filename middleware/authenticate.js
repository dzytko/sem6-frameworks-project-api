const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({message: 'No token provided'})
        return
    }
    if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.status(401).json({message: 'Invalid token'})
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.log(process.env.JWT_PRIVATE_KEY)
            console.log(err)
            console.log(req.headers.authorization)
            res.status(401).json({message: 'Invalid token'});
            return
        }
        req.user = decoded;
        next();
    }, null);
}


module.exports = {authenticate: authenticate}