/**
 * DONE: 
 * GET /all
 * GET /:id
 * POST /new/:id
 * 
 * TODO: 
 * PUT /edit/:id
 * DELETE /delete/one/:id (stock ID)
 * DELETE /delete/all/:id (user ID)
 */

const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Stock = require('../models/Stock');

// bring in auth middleware
const verifyToken = require('../utils/auth.js');

// GET ALL STOCK DOCUMENTS FOR ONE USER
router.get('/user', verifyToken, async (req, res) => {
    // get user ID from token
    let token = req.headers.authorization.split(' ').pop().trim();
    let decoded = jwt.decode(token);

    let stocks = await Stock.find({ user: decoded.data._id });

    if(!stocks) {
        return res.json({ message: 'No stocks found...' });
    }

    return res.json(stocks);
});

// GET STOCK DOCUMENT IN DATABASE
router.get('/one/:stock', verifyToken, async (req, res) => {
    console.log(req.params.stock)
    
    try {
        let stock = await Stock.findOne({ '_id': req.params.stock });
        return res.json(stock);
    }
    catch(err) {
        console.log(err);
        return res.json({ message: 'No stock found with that ID...' });
    }
});

// POST NEW STOCK DOCUMENT FOR USER
router.post('/new', verifyToken, async (req, res) => {
    // check to see if that symbol already used by that specific user
    let checkSymbol = await Stock.findOne({ symbol: req.body.symbol });

    if(checkSymbol != null) {
        return res.json({ message: 'Symbol already exists for that user!' });
    }

    // get user ID from token
    let token = req.headers.authorization.split(' ').pop().trim();
    let decoded = jwt.decode(token);

    // strictly define what fields go to database
    let strippedReq = {
        symbol: req.body.symbol, 
        shares: req.body.shares,
        user: decoded.data._id
    };

    let stock = new Stock(strippedReq);

    stock.save((err, newStock) => {
        if(err) return res.json(err);

        return res.json(newStock);
    });
}); 

// Put/EDIT route for stock
router.put('/edit/:id', verifyToken, async (req, res) => {
    try {
        // locate current stock
        let symbol = await Stock.findOne({ '_id': req.params.id });

        // update fields
        symbol.shares = req.body.shares;

        // save symbol
        await symbol.save();

        // return saved doc 
        return res.json({ message: `${req.params.id} updated to ${req.body.shares} shares` });
    }
    catch(err) {
        return res.json({ message: 'Could not edit!' });
    }  
});

// Delete 
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        await Stock.deleteOne({ '_id': req.params.id });
        
        return res.json({ message: 'Stock deleted!' });
    }
    catch (err) {
        return res.json({ message: 'Unable to delete!' });
    }
});

module.exports = router;