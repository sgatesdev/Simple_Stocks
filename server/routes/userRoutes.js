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

router.put('/edit', verifyToken, async (req, res) => {
    // get user ID from token
    let token = req.headers.authorization.split(' ').pop().trim();
    let decoded = jwt.decode(token);
    
    let user = await User.findOne({ '_id': decoded.data._id });

    user.email = req.body.email;
    user.username = req.body.username;

    let checkPass = await user.isCorrectPassword(req.body.current_password);

    if(!checkPass) {
        return res.json({ message: 'Incorrect password!' });
    }

    user.changePassword(req.body.password);

    user.save((err, newUser) => {
        if(err) return res.json(err);

        return res.json(newUser);
    });
});

router.get('/me', verifyToken, async (req, res) => {
    // get user ID from token
    let token = req.headers.authorization.split(' ').pop().trim();
    let decoded = jwt.decode(token);

    let user = await User.findOne({ '_id': decoded.data._id });

    if(!user) {
        return res.json({ message: 'No user with that ID found.' });
    }

     return res.json(user);
});


router.get('/id/:id', verifyToken, async (req, res) => {
    let user = await User.findOne({ '_id': req.params.id });

    if(!user) {
        return res.json({ message: 'No user with that ID found.' });
    }

    console.log(user);
    return res.json(user);
});

module.exports = router;