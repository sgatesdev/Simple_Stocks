const router = require('express').Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.TOKEN_SECRET;

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    let correctPass = await user.isCorrectPassword(password);

    if(!correctPass) return res.json({ message: 'Error logging in!' });

    const token = signToken(username, user.email, user._id);

    return res.json(token);
});

const signToken = (username, email, _id) => {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: '1h' })
}

module.exports = router;