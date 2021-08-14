/**
 * Main app page - this will handle routing 
 */

// pages
import Home from './js/pages/Home.js';

export default class StockApp extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./css/styles.css">
            
            <div class="header">
                <h3>Simple Stocks</h3>
                <stock-navbar>
                </stock-navbar>
            </div>

            <div class="addStock">
            <!-- Put form here -->
            </div>

            <div class="warning">
            <!-- No stock warning goes here -->
            </div>

            <div class="content">
            <!-- STOCK CARDS GO HERE -->
            </div>
        `;
    }

    connectedCallback() {
        const appRoot = this.shadowRoot.querySelector('.content');

        appRoot.innerHTML = `<stock-pages-home></stock-pages-home>`;
    }
}

