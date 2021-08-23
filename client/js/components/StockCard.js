/**
 * StockCard web component: renders stock info and calculates value of holding
 */
const template = document.createElement('template');

template.innerHTML = `
    <link rel="stylesheet" href="./css/stockCard.css">

    <div class="card-container">
        <div class="stock-symbol">
            <svg id="deleteCard" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            <h2 id="stock-symbol-text">Card Title</h3>
        </div>
        <div class="stock-data">
            <h4>Price</h4>
            <p id="stock-price-text"></p>
            <h4>Shares</h4>
            <p id="stock-shares-text"></p>
        </div>
        <div class="stock-value">
            <svg id="toggleData" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-expand" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M3.646 10.146a.5.5 0 0 1 .708 0L8 13.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-4.292a.5.5 0 0 0 .708 0L8 2.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zM1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8z"/>
            </svg>
            <h3 id="stock-value-text">Stock Value</h3>
        </div>
    </div>
`;

export default class StockCard extends HTMLElement {
    constructor() {
        super();

        // set variables 
        this.shares = this.getAttribute('shares');
        this.symbol = this.getAttribute('symbol');

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // set title for card
        this.shadowRoot.querySelector('#stock-symbol-text').innerText = this.symbol;

        // set initial values for price, shares, value
        this.shadowRoot.querySelector('#stock-price-text').innerText = this.price;

        this.shadowRoot.querySelector('#stock-shares-text').innerText = this.shares;

        this.shadowRoot.querySelector('#stock-value-text').innerText = this.getValue();

        // display data by default
        this.displayData = true;
    }

    getValue() {
        let total = this.shares * this.price;
        return this.formatPrice(total);
    }

    formatPrice(number) {
        const formattedNum = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);

        return formattedNum;
    }

    // watch for changes to attributes below
    static get observedAttributes() {
        return ["symbol", "price", "shares"];
    }

    // when they change, update values so it re-renders properly
    // this was necessary to allow document.createElement and 
    // setAttribute to work properly without returning null values  
    async attributeChangedCallback(name, oldValue, newValue) {
        // if values haven't changed, do nothing
        if (oldValue === newValue) {
            return;
        }

        // set object properties correctly 
        this[name] = newValue;
        this.shadowRoot.querySelector(`#stock-${name}-text`).innerText = newValue;

        if (!this.price) {
            this.price = await this.getPrice();
        }

        // display price
        this.shadowRoot.querySelector(`#stock-price-text`).innerText = `$${this.price}`;

        // calculate value of holding and render to card
        this.shadowRoot.querySelector('#stock-value-text').innerText = this.getValue();
    }

    // set up toggling display of content
    connectedCallback() {
        //this.refreshPrice = setInterval(this.getPrice, 30000);

        this.shadowRoot.querySelector('#toggleData').addEventListener('click', this.toggleDataDisplay.bind(this));
        this.shadowRoot.querySelector('#deleteCard').addEventListener('click', this.deleteCard.bind(this));
    }

    // remove event listener
    disconnectedCallback() {
        this.shadowRoot.querySelector('#toggleData').removeEventListener('click', this.toggleDataDisplay.bind(this));
        this.shadowRoot.querySelector('#deleteCard').removeEventListener('click', this.deleteCard.bind(this));
    }

    // toggle display
    toggleDataDisplay() {
        this.displayData = !this.displayData;

        let stockData = this.shadowRoot.querySelector('.stock-data');

        if (this.displayData) {
            stockData.style.display = 'block';
        }
        else {
            stockData.style.display = 'none';
        }
    }

    deleteCard() {
        // delete card from local storage
        const store = new StoredCards();

        this.card = this.shadowRoot.querySelector('.card-container');

        // warning defined in stockList.js
        if (store.numCards() - 1 === 0) {
             store.deleteCard(this.symbol);
             return this._displayWarning();
        }
        
        store.deleteCard(this.symbol);
        this.card.remove();
    }

    // get price
    async getPrice() {
        // FinnHub API key
        const key = 'c162mdv48v6ootkka5hg';

        const data = await fetch(`https://finnhub.io/api/v1/quote?symbol=${this.symbol}&token=${key}`);

        const priceData = await data.json();

        return priceData.c;
    }

    _displayWarning() {
        this.card.setAttribute('style','width: 100%');
        this.card.innerHTML = `<h3>No stocks found. Please add a stock to your collection!</h3>`;
    }
}

window.customElements.define('stock-card', StockCard);