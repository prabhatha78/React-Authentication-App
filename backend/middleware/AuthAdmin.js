const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const verifyLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
        jwt.verify(token, 'meralkey', async (err, decoded) => {
            // console.log(decoded.iat);

            if (err) {
                res.json({ status: false });
            } else {
                const user = userModel.findById({ _id: decoded.id });
                if (user) {
                    next();
                } else {
                    res.json({ status: false })
                }
            }
        });
    } else {
        res.json({ status: false, message:"permission not allowed" })
    }
}

module.exports = { verifyLogin }