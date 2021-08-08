/**
 * This simple web component displays a form to the user for adding a stock
 */

import { clearWarning } from "../utils/warningMsg.js";
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

export default class AddStockForm extends HTMLElement {
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
        form.removeEventListener(this.onSubmit);
    }

    onSubmit(e) {
        e.preventDefault();

        // zero out warning 
        clearWarning();

        // get inputs, including values, from DOM 
        let symbol = this.shadowRoot.getElementById('newStockSymbol');
        let shares = this.shadowRoot.getElementById('newStockShares');
        let docRoot = document.querySelector('.content');

        // generate card using custom element! 
        const newCard = document.createElement('stock-card');

        newCard.setAttribute('symbol', symbol.value);
        newCard.setAttribute('shares', shares.value);
        
        // add card to dom 
        docRoot.append(newCard);

        // add card to local storage
        const store = new StoredCards();
        store.addCard(symbol.value,shares.value);

        // clear out form
        symbol.value = '';
        shares.value = '';
    }
}