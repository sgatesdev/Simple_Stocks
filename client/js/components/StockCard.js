/**
 * StockCard web component: renders stock info and calculates value of holding
 */

import * as Utilities from "../utils.js";

export default class StockCard extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        this.render();

        // display data by default
        this.displayData = true;
    }

    // watch for changes to attributes below
    static get observedAttributes() {
        return ["symbol", "price", "shares", "value"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // if values haven't changed, do nothing
        if (oldValue === newValue) {
            return;
        }

        // set object properties correctly 
        this[name] = newValue;
        this.shadowRoot.querySelector(`#stock-${name}-text`).innerText = newValue;
    }

    // set up toggling display of content
    connectedCallback() {
        this.shadowRoot.querySelector('#toggleData').addEventListener('click', () => this.toggleDataDisplay());
        this.shadowRoot.querySelector('#deleteCard').addEventListener('click', () => this.deleteCard());
        this.token = localStorage.getItem('simple-stocks-jwt');
    }

    // toggle display
    toggleDataDisplay() {
        this.displayData = !this.displayData;
        let stockData = this.shadowRoot.querySelector('.stock-data');
        stockData.style.display = this.displayData ? 'block' : 'none';
    }

    refreshHome() {
        let refreshEvent = new CustomEvent("home-refresh", { bubbles: true });
        this.dispatchEvent(refreshEvent);
    }

    async deleteCard() {
        // get ID from attributes
        let stockId = this.getAttribute('data-id');

        // delete card from database
        let res = await fetch(`${Utilities.API_ROOT}/stock/delete/${stockId}`, {
            method: 'DELETE',
            headers: Utilities.getDefaultHeaders(this.token)
        });
        // look at response, make sure stock was deleted
        let data = await res.json();
        if (data?.message === 'Stock deleted!') {
            this.refreshHome();
        }
        else {
            alert('Could not delete stock! Please try again.');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" type="text/css" href="css/stockCard.css">
    
        <div class="card-container">
            <div class="stock-symbol">
                <svg id="deleteCard" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <h2 id="stock-symbol-text">${this.symbol}</h2>
            </div>
            <div class="stock-data">
                <h4>Price</h4>
                <p id="stock-price-text">${this.price}</p>
                <h4>Shares</h4>
                <p id="stock-shares-text">${this.shares}</p>
            </div>
            <div class="stock-value">
                <svg id="toggleData" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-expand" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M3.646 10.146a.5.5 0 0 1 .708 0L8 13.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-4.292a.5.5 0 0 0 .708 0L8 2.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zM1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8z"/>
                </svg>
                <h3 id="stock-value-text">${this.value}</h3>
            </div>
        </div>
    `;
    }
}

window.customElements.define('stock-card', StockCard);