const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    // #swagger.security = [{bearerAuth: []}]
    const authorizationString = "authorization" // dirty hack to stop swagger from showing this parameter
    const authentication = req.headers[authorizationString]

    if (!authentication) {
        res.status(401).json({message: 'No token provided'})
        return
    }
    if (authentication.split(' ')[0].toLowerCase() !== 'bearer') {
        res.status(401).json({message: 'Invalid token'})
        return
    }
    const token = authentication.split(' ')[1]

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(401).json({message: 'Invalid token'});
            return
        }
        req.user = decoded;
        next();
    }, null);
}

module.exports = {authenticate: authenticate}