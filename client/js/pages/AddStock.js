/**
 * Page to handle adding a stock
 */

import { BACKEND_URL } from "../config.js";

export default class AddStock extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });

        this._render();
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('#addStockForm');
        form.addEventListener('submit', (e) => this.onSubmit(e));

        // grab token from local storage to authenticate request 
        this.token = localStorage.getItem('simple-stocks-jwt');
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#addStockForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    async onSubmit(e) {
        e.preventDefault();

        //get inputs, including values, from DOM 
        let symbol = this.shadowRoot.getElementById('newStockSymbol').value.trim().toUpperCase();
        let shares = this.shadowRoot.getElementById('newStockShares').value;

        // basic error checking
        if(symbol === '' || shares === '' || isNaN(shares)) {
            return this._displayError('Please enter all required information.');
        }

        // put data into var to send 
        let newStock = {
            symbol,
            shares
        };

        // save new stock selection
        let res = await fetch(`${BACKEND_URL}/stock/new/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStock)
        });

        let fullRes = await res.json();

        // if we get back an error message, display it 
        if(fullRes.message) {
            this._displayError(fullRes.message);
        }
        else {
            this._navigate();
        }
    }

    _navigate() {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'home' }
        });
        this.dispatchEvent(navigateEvent);
    }

    _displayError(err) {
        this.shadowRoot.querySelector('#formError').innerHTML = err;
    }

    _render() {
        this.shadowRoot.innerHTML =  `
        <style>
            button {
                border-radius: 5px;
                padding: 5px;
                margin-left: 5px;
                background-color: #513aff;
                font-weight: bold;
                color: white;
            }

            #formError {
                color: red;
                width: 200px;
            }

            div {
                margin: 5px 0px;
            }
        </style>
        <form action="#" id="addStockForm">
            <div>
            <input type="text" name="stockName" placeholder="Symbol" id="newStockSymbol">
            </div>
            <div>
            <input type="text" name="stockShares" placeholder="Shares" id="newStockShares">
            </div>

            <button type="submit">Add Stock</button>
        </form>
        <p id="formError"></p>
        `;
    }
}

window.customElements.define('stock-pages-add', AddStock);