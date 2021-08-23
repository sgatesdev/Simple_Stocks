/**
 * Main app page - this will handle routing 
 */

// import pages
import Home from './js/pages/Home.js';
import AddStock from './js/pages/AddStock.js';
import Login from './js/pages/Login.js';

// import navbar component
import Navbar from './js/components/Navbar.js';

export default class StockApp extends HTMLElement {
    constructor() {
        super();

        // create shadow dom, render shell for app 
        this.attachShadow({ mode: 'open' });
        this._render();

        // set root for content within app 
        this.appRoot = this.shadowRoot.querySelector('.content');

        // default value for loggedIn
        this.loggedIn = false;
    }

    connectedCallback() {   
        // start listening for route changes on load
        this._initializeRouter();

        // set default route
        this._changeRoute('home');
    }

    _initializeRouter() {
        console.log('Router initiated...')

        // listen for button click, redirect user
        this.shadowRoot.addEventListener('route-change', (e) => {
            // if logged in, tell navbar to update menu by changing attribute
            this.token = localStorage.getItem('simple-stocks-jwt');

            if(this.token) {
                console.log('here')
                this.loggedIn = true;

                const navbar = this.shadowRoot.querySelector('stock-navbar');
                navbar.setAttribute('logged', 'true');
            }

            console.log(`Routing to ${e.detail.route}`)

            this._changeRoute(e.detail.route);
        });

        // listen for the user to click browser buttons, use history to navigate them around
        window.addEventListener('popstate', (e) => {
            this._changeRoute(e.state.page);
        });
    }

    _changeRoute(page) {
        switch(page) {
            case 'login':
                this.appRoot.innerHTML = `<stock-pages-login></stock-pages-login>`;
                history.pushState({page: 'login'}, '', '/login');
                break;               
            case 'signup':
                this.appRoot.innerHTML = `<stock-pages-signup></stock-pages-signup>`;
                history.pushState({page: 'signup'}, '', '/signup');
                break;
            case 'add':
                this.appRoot.innerHTML = `<stock-pages-add></stock-pages-add>`;
                history.pushState({page: 'add'}, '', '/add');
                break;
            default: 
                this.appRoot.innerHTML = `<stock-pages-home></stock-pages-home>`;
                history.pushState({page: 'home'}, '', '/');
                break;
        }
    }

    _render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./css/styles.css">
        
        <div class="header">
            <h3>Simple Stocks</h3>
            <stock-navbar logged="false">
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
}