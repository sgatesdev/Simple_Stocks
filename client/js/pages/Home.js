/**
 * Home page
 */

import StockCard from '../components/StockCard.js';

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
        let res = await fetch('http://localhost:3001/stock/user/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        this._stockData = await res.json();
    }

    _displayStocks() {

        // iterate through stocks to generate cards for each stock, display on page 
        this._stockData.forEach(stock => {
            const newCard = document.createElement('stock-card');

            newCard.setAttribute('symbol', stock.symbol);
            newCard.setAttribute('shares', stock.shares);
            newCard.setAttribute('price', stock.price);
            newCard.setAttribute('data-id', stock._id)

            this.homePageContent.append(newCard);
        });
    }

    async _renderLogged() {
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