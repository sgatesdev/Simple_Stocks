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
const Stock = require('../models/Stock');

// bring in auth middleware
const verifyToken = require('../utils/auth.js');

// GET ALL STOCK DOCUMENTS FOR ONE USER
router.get('/all/:user', verifyToken, async (req, res) => {
    let stocks = await Stock.find({ user: req.params.user });

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
    let checkSymbol = await Stock.findOne({ symbol: req.body.symbol, user: req.body.user });

    if(checkSymbol != null) {
        return res.json({ message: 'Symbol already exists for that user!' });
    }

    let strippedReq = {
        symbol: req.body.symbol, 
        user: req.body.user
    };

    let stock = new Stock(strippedReq);

    stock.save((err, newStock) => {
        if(err) return res.json(err);

        return res.json(newStock);
    });
}); 

module.exports = router;