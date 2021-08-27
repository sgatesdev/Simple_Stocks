import { BACKEND_URL } from "../config.js";

export default class Navbar extends HTMLElement {
    constructor() {
        super();

        // create shadowDOM and render component shell
        this.attachShadow({ mode: 'open' });
        this._renderRoot();

        // set default for loggedIn (this toggles the menus)
        this.loggedIn = false;

        // set root for navbar to drop into
        this.navList = this.shadowRoot.querySelector('.navbar');
    }

    // when component loads, render default menu 
    connectedCallback() {
        this.token = localStorage.getItem('simple-stocks-jwt');

        this.token ? this._checkToken() : this._renderDefault();
    }

    // watch the logged attribute for changes
    // i learned that this is case sensitive, and components do not like camel casing
    // at least not in chrome
    static get observedAttributes() {
        return ["logged"];
    }

    // callback when changes are made to logged
    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === newValue) return; 

        this.loggedIn = newValue;

        this.loggedIn ? this._renderLogged() : this._renderDefault();
    }


    // dispatch event to StockApp to switch pages
    _navigate(page) {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: page }
        });
        this.dispatchEvent(navigateEvent);
    }

    // displays default menu
    _renderDefault() {
        this.navList.innerHTML = `
        <ul>
        <li>
            <span id="nav-home">Home</span> |
        </li>
        <li>
            <span id="nav-login">Login</span> |
        </li>
        <li>
        <span id="nav-signup">Sign Up</span>
        </li>
        </ul>
        `;

        // add event listeners for menu items
        this.shadowRoot.querySelector('#nav-home').addEventListener('click', () => this._navigate('home'));

        this.shadowRoot.querySelector('#nav-login').addEventListener('click', () => this._navigate('login'));

        this.shadowRoot.querySelector('#nav-signup').addEventListener('click', () => this._navigate('signup'));
    }

    // displays logged in menu w/ event listeners for navigation
    _renderLogged() {
        this.navList.innerHTML = `
        <ul>
        <li>
            <span id="nav-home">Home</span> |
        </li>
        <li>
            <span id="nav-add">Add Stock</span> |
        </li>
        <li>
            <span id="nav-profile">Profile</span> |
        </li>
        <li>
            <span id="nav-logout">Log out</span>
        </li>
        </ul>
        `;

        // add event listeners for menu items
        this.shadowRoot.querySelector('#nav-home').addEventListener('click', () => this._navigate('home'));

        this.shadowRoot.querySelector('#nav-add').addEventListener('click', () => this._navigate('add'));

        this.shadowRoot.querySelector('#nav-profile').addEventListener('click', () => this._navigate('profile'));

        this.shadowRoot.querySelector('#nav-logout').addEventListener('click', () => this._navigate('logout'));        
    }

    // render container for component w/ styling
    _renderRoot() {
        this.shadowRoot.innerHTML = `
        <style>
            .navbar {
                display: flex;
                justify-content: center;
            }
            
            ul { 
                display: flex;
                list-style: none
            }

            li {
                margin: 0px 5px;
            }

            span[id*=nav] {
                text-decoration: none;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }

            span[id*=nav]:hover {
                color: black;
            }
        </style>

        <div class="navbar">
        </div>    
        `;
    }

    async _checkToken() {
        // see if token is valid 

        // grab user info from server 
        let res = await fetch(`${BACKEND_URL}/user/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        let data = await res.json();

        // if there's a message...it's not valid 
        if(data.message) {
            localStorage.removeItem('simple-stocks-jwt');
            this._renderDefault();
        }
        else {
            this._renderLogged();
        }
    }
}

window.customElements.define('stock-navbar', Navbar);