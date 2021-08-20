const router = require('express').Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.TOKEN_SECRET;
const expires = process.env.TOKEN_EXPIRES;

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if(!user) return res.json({ 'error': 'Invalid user!' });

    let correctPass = await user.isCorrectPassword(password);

    if(!correctPass) return res.json({ 'error': 'Error logging in!' });

    const token = signToken(username, user.email, user._id);

    return res.json({ token });
});

const signToken = (username, email, _id) => {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expires })
}

module.exports = router;