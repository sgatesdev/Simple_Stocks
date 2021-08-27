/**
 * utility functions for Finnhub.io API
 */

const axios = require('axios');
const key = process.env.FINNHUB_KEY;

const validateSymbol = async (symbol) => {
    let apiPath = `https://finnhub.io/api/v1/search?q=${symbol}&token=${key}`;

    let valid = false;

    try {
        const response = await axios.get(apiPath);

        response.data.result.forEach(stock => {
            if(stock.symbol === symbol) {
                valid = true;
            }
        })
    }
    catch (err) {
        console.log(err);
    }

    return valid;
}

const getPrice = async (symbol) => {
    let apiPath = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;

    try {
        const response = await axios.get(apiPath);

        return response.data.c;
    }
    catch (err) {
        console.log(err);

        return null;
    }
}

const formatPrice = (number) => {
    const formattedNum = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);

    return formattedNum;
}

module.exports = { validateSymbol, getPrice, formatPrice };