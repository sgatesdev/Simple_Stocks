/**
 * GET /:id
 * POST /new
 * PUT /edit/:id
 * DELETE /delete/:id (make sure it cascades through symbols)
 */

const router = require('express').Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.TOKEN_SECRET;
const expires = process.env.TOKEN_EXPIRES;

// bring in auth middleware
const verifyToken = require('../utils/auth.js');

router.post('/new', async (req, res) => {
    let user = new User(req.body);

    user.save((err, newUser) => {
        if(err) return res.json(err);

        const payload = { username: req.body.username, email: req.body.email, _id: newUser._id }

        const token = jwt.sign({ data: payload }, secret, { expiresIn: expires });

        return res.json(token);
    });
});

router.get('/:id', verifyToken, async (req, res) => {
    let user = await User.findOne({ '_id': req.params.id });

    if(!user) {
        return res.json({ message: 'No user with that ID found.' });
    }

    console.log(user);
    return res.json(user);
});

module.exports = router;