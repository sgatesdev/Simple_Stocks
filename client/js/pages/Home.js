/**
 * Home page
 */

// components
import StockCard from '../components/StockCard.js';

// utils
import StoredCards from "../utils/storedCards.js";

export default class Home extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div style="display: flex; flex-wrap: wrap" id="homePageContent">
            </div>
        `;
    }

    connectedCallback() {
        // pull cards from localstorage
        this.store = new StoredCards();
        this.stocks = this.store.getCardsArray();

        if(this.stocks.length === 0) {
            this._displayWarning();
        }
        else {
            this._displayStocks();
        }
    }

    _displayWarning() {
        const warning = document.querySelector('.warning');

        warning.innerHTML = `<h3>No stocks found. Please <a href="/add" data-navigo>add</a> a stock to your collection!</h3>`;
    }

    _displayStocks() {
        // iterate through stocks to generate cards for each stock, display on page 
        this.stocks.forEach(stock => {
            const newCard = document.createElement('stock-card');

            newCard.setAttribute('symbol', stock.symbol);
            newCard.setAttribute('shares', stock.shares);
            newCard.setAttribute('price', stock.price);

            const homePageContent = this.shadowRoot.querySelector('#homePageContent');

            homePageContent.append(newCard);
        });
    }
}

window.customElements.define('stock-pages-home', Home);