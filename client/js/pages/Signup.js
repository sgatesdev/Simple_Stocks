/**
 * Page to handle sign up
 */

 import * as Utilities from "../utils.js";

 export default class Signup extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });

        this.renderForm();

        this.errorContainer = this.shadowRoot.querySelector('#error');
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('#signupForm');
        form.addEventListener('submit', (e) => this.onSubmit(e));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#signupForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    onSubmit(e) {
        e.preventDefault();

        //get inputs, including values, from DOM 
        this.username = this.shadowRoot.getElementById('username').value;
        this.email = this.shadowRoot.getElementById('email').value;
        this.password = this.shadowRoot.getElementById('password').value;

        let confirm = this.shadowRoot.getElementById('confirm').value;

        if(this.username === '') {
            return this.errorContainer.innerHTML = 'Please enter a username';
        }

        if(this.email === '') {
            return this.errorContainer.innerHTML = 'Please enter an email';
        }

        if(this.password === '') {
            return this.errorContainer.innerHTML = 'Please enter a password';
        }

        if(confirm === '') {
            return this.errorContainer.innerHTML = 'Please enter password again';
        }

        if(this.password !== confirm) {
            return this.errorContainer.innerHTML = 'Please enter matching passwords';
        }

        // validation passed, create user
        this.createUser();
    }

    async createUser() {
        // put data into var to send 
        let newUser = {
            username: this.username,
            email: this.email,
            password: this.password
        };

        console.log(newUser)
        
        // save new stock selection
        let res = await fetch(`${Utilities.API_ROOT}/user/new/`, {
            method: 'POST',
            headers: Utilities.getDefaultHeaders(),
            body: JSON.stringify(newUser)
        });
        
        if(res.ok) {
            let token = await res.json();
            localStorage.setItem('simple-stocks-jwt', token);
            Utilities.changePage('home');
        } 
        else {
            this.errorContainer.innerHTML = 'There was an error creating user';
        }
    }

    renderForm() {
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

            #error {
                margin: 0px;
                padding-top: 5px;
                color: red;
                width: 100%;
                text-align: center;
            }
        </style>
        <p id="error"></p>
        <form action="#" id="signupForm">
            <div>
                <input type="text" name="username" placeholder="Username" id="username">
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