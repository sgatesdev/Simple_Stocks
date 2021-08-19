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

// GET /all/userID
router.get('/all/:user', async (req, res) => {
    let stocks = await Stock.find({ user: req.params.user });

    if(!stocks) {
        return res.json({ message: 'No stocks found...' });
    }

    return res.json(stocks);
});

// GET /one/stockID
router.get('/one/:stock', async (req, res) => {
    let stock = await Stock.find({ _id: req.params.stock });

    if(!stock) {
        return res.json({ message: 'No stock found with that ID...' });
    }

    return res.json(stock);
});

// POST /new/symbol
router.post('/new/:symbol', async (req, res) => {
    // check to see if that symbol already used by that specific user
    let checkSymbol = Stock.find({ symbol: req.body.symbol, user: req.body.user });

    if(checkSymbol) {
        return res.json({ message: 'Symbol already exists for that user!' });
    }

    let strippedReq = {};

    // remove token (future)
    for (const property in object) {
        if(property !== 'token') {
            strippedReq[property] = object[property];
        }
    }

    let stock = new Stock(strippedReq);

    stock.save((err, res) => {
        if(err) return res.json(err);

        return res.json(res);
    });
}); 

module.exports = router;