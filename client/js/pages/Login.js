 /**
 * Page to handle adding a stock
 */

import { BACKEND_URL } from '../config.js';

export default class Login extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this._render();
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('#loginForm');
        form.addEventListener('submit', (e) => this.onSubmit(e));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#loginForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    onSubmit(e) {
        e.preventDefault();
        
        // get inputs, including values, from DOM 
        this.username = this.shadowRoot.getElementById('username').value;
        this.password = this.shadowRoot.getElementById('password').value;

        // basic error handling
        if(this.username.length === 0) {
            return this._displayError('Please enter a username!');
        }

        if(this.password.length === 0) {
            return this._displayError('Please enter a password!');
        }

        // if it passes, log the user in
        this.loginUser();
    }

    async loginUser() {
        // send credentials to API 
        const res = await fetch(`${BACKEND_URL}/auth/login`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            }
        );

        // format response into JSON
        const formatRes = await res.json();

        if(formatRes.error) {
            return this._displayError(formatRes.error);
        }

        // set the token in place
        localStorage.setItem('simple-stocks-jwt', formatRes.token);

        // take user back to main page
        this._navigate();
    }

    _navigate() {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'home', loggedIn: true }
        });
        this.dispatchEvent(navigateEvent);
    }

    _displayError(err) {
        this.shadowRoot.querySelector('#formError').innerHTML = err;
    }

    _render() {
        this.shadowRoot.innerHTML = `
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
        <form action="#" id="loginForm">
            <div>
            <input type="text" name="username" placeholder="Username" id="username">
            </div>
            <div>
            <input type="password" name="password" placeholder="Password" id="password">
            </div>
            <button type="submit">Login</button>
        </form>
        <p id="formError"></p>
        `;
    }
}

window.customElements.define('stock-pages-login', Login);