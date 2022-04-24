/**
 * Home page
 */

import StockCard from '../components/StockCard.js';
import * as Utilities from "../utils.js";

export default class Home extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" type="text/css" href="css/styles.css">
        <div style="display: flex; flex-wrap: wrap" id="homePageContent">
        </div>
        `;
        this.homePageContent = this.shadowRoot.querySelector('#homePageContent');
        this.shadowRoot.addEventListener('home-refresh', () => this.connectedCallback());
    }

    connectedCallback() {
        this.token = localStorage.getItem('simple-stocks-jwt');
        this.token ? this.renderLogged() : this.renderDefault();
    }

    displayWarning() {
        this.homePageContent.innerHTML = `<h3>Add stocks to get started!</h3>`;
    }

    async fetchStocks() {
        // buffer loading message
        let loadingTimeout = setTimeout(() => {
            this.homePageContent.innerHTML = `
            <h3>Loading your stocks...</h3>
            `;
        }, 500);

        // get stocks from database
        let res = await fetch(`${Utilities.API_ROOT}/stock/user/`, {
            method: 'GET',
            headers: Utilities.getDefaultHeaders(this.token)
        });

        let data = await res.json();

        // clear buffered loading message if it hasn't fired yet 
        clearTimeout(loadingTimeout);

        if(data.message) {
            localStorage.removeItem('simple-stocks-jwt');
            this.stockData = [];
        }
        else {
            this.stockData = [...data.stocks];
            this.portfolioValue = data.value;
        }
    }

    setPortfolioValueDisplay(value = this.portfolioValue) {
        let docHead = document.querySelector('stock-app').shadowRoot.querySelector('.pageHeader');
        docHead.innerHTML = value;
    }

    displayStocks() {
        // reset page
        this.homePageContent.innerHTML = ``;
        this.setPortfolioValueDisplay('');

        if(this.stockData.length === 0) {
            return this.displayWarning();
        }

        // iterate through stocks to generate cards for each stock, display on page 
        this.stockData.forEach(stock => {
            const newCard = document.createElement('stock-card');
            newCard.setAttribute('symbol', stock.symbol);
            newCard.setAttribute('shares', stock.shares);
            newCard.setAttribute('price', stock.price);
            newCard.setAttribute('value', stock.value);
            newCard.setAttribute('data-id', stock._id)
            this.homePageContent.append(newCard);
        });

        this.setPortfolioValueDisplay();
    }

    async renderLogged() {
        // get stocks
        await this.fetchStocks();
        // render cards
        this.displayStocks();
    }

    renderDefault() {
        this.homePageContent.innerHTML = `
        <h3>Please log in to see your stocks</h3>
        `;
    }
}

window.customElements.define('stock-pages-home', Home);