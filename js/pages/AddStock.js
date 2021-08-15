/**
 * Page to handle adding a stock
 */

import StoredCards from "../utils/storedCards.js";

const template = document.createElement('template');

template.innerHTML = `
    <style>
        button {
            border-radius: 5px;
            padding: 5px;
            margin-left: 5px;
            background-color: #513aff;
            font-weight: bold;
            color: white;
        }
    </style>
    <form action="#" id="addStockForm">
        <input type="text" name="stockName" placeholder="Symbol" id="newStockSymbol">

        <input type="text" name="stockShares" placeholder="Shares" id="newStockShares">

        <button type="submit">Add Stock</button>
    </form>
`;

export default class AddStock extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('#addStockForm');
        form.addEventListener('submit', (e) => this.onSubmit(e));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#addStockForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    onSubmit(e) {
        e.preventDefault();

        //get inputs, including values, from DOM 
        let symbol = this.shadowRoot.getElementById('newStockSymbol');
        let shares = this.shadowRoot.getElementById('newStockShares');

        // add card to local storage
        const store = new StoredCards();
        store.addCard(symbol.value,shares.value);

        // make sure warning is clear
        this._navigate();
    }

    _navigate() {
        // figure out how to do this
        this.testEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'home' }
        });
        this.dispatchEvent(this.testEvent);
    }
}

window.customElements.define('stock-pages-add', AddStock);