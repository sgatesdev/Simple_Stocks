/**
 * Home page
 */

import StockCard from '../components/StockCard.js';
import { BACKEND_URL } from '../config.js';

export default class Home extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div style="display: flex; flex-wrap: wrap" id="homePageContent">
        </div>
        `;
        this.homePageContent = this.shadowRoot.querySelector('#homePageContent');
    }

    connectedCallback() {
        this.token = localStorage.getItem('simple-stocks-jwt');

        this.token ? this._renderLogged() : this._renderDefault();
    }

    _displayWarning() {
        this.homePageContent.innerHTML = `<h3>No stocks found. Please add a stock to your collection!</h3>`;
    }

    async _fetchStocks() {
        // get stocks from database
        let res = await fetch(`${BACKEND_URL}/stock/user/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        let data = await res.json();

        if(data.message) {
            localStorage.removeItem('simple-stocks-jwt');
            this._stockData = [];
        }
        else {
            this._stockData = [...data.stocks];
            this._portfolioValue = data.value;
        }
    }

    _displayStocks() {
        // reset content
        this.homePageContent.innerHTML = ``;

        if(this._stockData.length === 0) {
            return this.homePageContent.innerHTML = `
            <h1>No stocks found! Please add a stock to your portfolio.</h1>
            `;
        }

        let totalValue = 0;

        // iterate through stocks to generate cards for each stock, display on page 
        this._stockData.forEach(stock => {
            const newCard = document.createElement('stock-card');

            newCard.setAttribute('symbol', stock.symbol);
            newCard.setAttribute('shares', stock.shares);
            newCard.setAttribute('price', stock.price);
            newCard.setAttribute('value', stock.value);
            newCard.setAttribute('data-id', stock._id)

            this.homePageContent.append(newCard);
        });

        let docHead = document.querySelector('stock-app').shadowRoot.querySelector('.pageHeader');

        docHead.innerHTML = this._portfolioValue;
    }

    async _renderLogged() {
        // display loading message
        this.homePageContent.innerHTML = `
        <h1>Loading your stocks...</h1>
        `;

        // get stocks
        await this._fetchStocks();

        // render cards
        this._displayStocks();
    }

    _renderDefault() {
        this.homePageContent.innerHTML = `
        <h1>Please log in to see your stocks</h1>
        `;
    }
}

window.customElements.define('stock-pages-home', Home);