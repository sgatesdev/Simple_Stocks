/**
 * Page to handle sign up
 */

 export default class Signup extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });

        this._renderForm();
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('#signupForm');
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
        let symbol = this.shadowRoot.getElementById('newStockSymbol').value;
        let shares = this.shadowRoot.getElementById('newStockShares').value;

        // put data into var to send 
        let newStock = {
            symbol,
            shares
        };

        // save new stock selection
        let res = await fetch('http://localhost:3001/stock/new/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStock)
        });
        
        // take user back to main page
        this._navigate();
    }

    _navigate() {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'home' }
        });
        this.dispatchEvent(navigateEvent);
    }

    _renderForm() {
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

            #signupForm div {
                margin: 5px 0px; 
            }
        </style>
        <form action="#" id="signupForm">
            <div>
                <input type="text" name="username" placeholder="Username" id="newUsername">
            </div>
            <div>
                <input type="text" name="email" placeholder="Email" id="email">
            </div>
            <div>
                <input type="password" name="password" placeholder="Password" id="password">
            </div>
            <div>
                <input type="password" name="confirm" placeholder="Confirm" id="confirm">
            </div>
            <button type="submit">Sign Up!</button>
        </form>
        `;
    }
}

window.customElements.define('stock-pages-signup', Signup);