/**
 * AUTHENTICATION CONFIG: JWT
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

// bring in environment variables 
const expires = process.env.TOKEN_EXPIRES;
const secret = process.env.TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
    if(!req.body.token) {
        return res.json({ message: 'MUST BE AUTHENTICATED!' });
    }

    let token = req.body.token;
    token = token.split(' ').pop().trim();

    try {
        jwt.verify(token, secret, { maxAge: expires });
    } catch (error) {
        return res.json({ message: 'INVALID TOKEN' });
    }

    return next();
};

module.exports = verifyToken;