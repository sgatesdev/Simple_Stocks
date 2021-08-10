/**
 * stockList displays saved stocks using custom web component StockCard
 */

// components
import StockCard from '../components/stockCard.js';

// utils
import StoredCards from "../utils/storedCards.js";
import { displayWarning } from "../utils/warningMsg.js";

// define web components on DOM
window.customElements.define('stock-card', StockCard);

// pull saved symbols from local storage
const store = new StoredCards();
const stocks = store.getCardsArray();

// set where i want all of the cards to go
const Home = document.createElement('div');

// display saved stocks or message to add a stock
if(stocks.length === 0) {
    displayWarning();
}
else {
    // iterate through stocks to generate cards for each stock, display on page 
    stocks.forEach(stock => {
        const newCard = document.createElement('stock-card');

        newCard.setAttribute('symbol', stock.symbol);
        newCard.setAttribute('shares', stock.shares);
        newCard.setAttribute('price', stock.price);
        
        Home.append(newCard);
    });
}

export default Home;