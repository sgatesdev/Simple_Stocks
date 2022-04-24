/**
 * Page to handle adding a stock
 */

 import * as Utilities from "../utils.js";

export default class AddStock extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        this.render();
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
            return this.displayError('Please enter all required information.');
        }

        // put data into var to send 
        let newStock = {
            symbol,
            shares
        };

        // save new stock selection
        let res = await fetch(`${Utilities.API_ROOT}/stock/new/`, {
            method: 'POST',
            headers: Utilities.getDefaultHeaders(this.token),
            body: JSON.stringify(newStock)
        });

        let fullRes = await res.json();

        // if we get back an error message, display it 
        if(fullRes.message) {
            this.displayError(fullRes.message);
        }
        else {
            Utilities.changePage('home');
        }
    }

    displayError(err) {
        this.shadowRoot.querySelector('#formError').innerHTML = err;
    }

    render() {
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