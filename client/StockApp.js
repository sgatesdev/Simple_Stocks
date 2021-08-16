/**
 * Main app page - this will handle routing 
 */

// import pages
import Home from './js/pages/Home.js';
import AddStock from './js/pages/AddStock.js';
import Navbar from './js/components/Navbar.js';

export default class StockApp extends HTMLElement {
    constructor() {
        super();

        this.loggedIn = true;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./css/styles.css">
            
            <div class="header">
                <h3>Simple Stocks</h3>
                <stock-navbar>
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

        this.appRoot = this.shadowRoot.querySelector('.content');
    }

    connectedCallback() {   
        // start listening for route changes
        this._initializeRouter();

        // set default route
        this._changeRoute('home');
    }

    _initializeRouter() {
        console.log('Router initiated...')
        // listen for button click, redirect user

        this.shadowRoot.addEventListener('route-change', (e) => {
            console.log(`Routing to ${e.detail.route}`)
            // check auth status
            this._changeRoute(this.loggedIn ? e.detail.route : 'login');
        });

        // listen for the user to click browser buttons, use history to navigate them around
        window.addEventListener('popstate', (e) => {
            // Log the state data to the console
            console.log(e.state);
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

    _changePage() {
        this.appRoot.innerHTML = `<stock-pages-home></stock-pages-home>`;
    }
}