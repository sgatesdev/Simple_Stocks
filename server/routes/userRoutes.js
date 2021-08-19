/**
 * GET /:id
 * POST /new
 * PUT /edit/:id
 * DELETE /delete/:id (make sure it cascades through symbols)
 */

const router = require('express').Router();
const User = require('../models/User');

// bring in auth middleware
const verifyToken = require('../utils/auth.js');

router.post('/new', async (req, res) => {
    let user = new User(req.body);

    user.save((err, newUser) => {
        console.log(newUser)
        if(err) return res.json(err);

        return res.json(newUser);
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