/**
 * AUTHENTICATION CONFIG: JWT
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

// bring in environment variables 
const expires = process.env.TOKEN_EXPIRES;
const secret = process.env.TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
    console.log('Verifying token...');

    if(!req.body.token) {
        return res.json({message: 'MUST BE AUTHENTICATED!'});
    }

    let token = req.body.token;
    token = token.split(' ').pop().trim();

    try {
        const test = jwt.verify(token, secret, { maxAge: expires });

        console.log(test);
    } catch (error) {
        return res.json({ message: 'Invalid token.' });
    }

    console.log('User authenticated!');
    return next();
};

module.exports = verifyToken;