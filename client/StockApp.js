/**
 * Main app page - this will handle routing 
 */

// import pages
import Home from './js/pages/Home.js';
import AddStock from './js/pages/AddStock.js';
import Login from './js/pages/Login.js';
import Signup from './js/pages/Signup.js';
import Profile from './js/pages/Profile.js';
import Username from './js/pages/profile/Username.js';
import Password from './js/pages/profile/Password.js';

// import navbar component
import Navbar from './js/components/Navbar.js';

export default class StockApp extends HTMLElement {
    constructor() {
        super();

        // create shadow dom, render shell for app 
        this.attachShadow({ mode: 'open' });
        this.render();

        // set root for content within app 
        this.appRoot = this.shadowRoot.querySelector('.content');

        // default value for loggedIn
        this.loggedIn = false;
    }

    connectedCallback() {   
        // start listening for route changes on load
        this.initializeRouter();

        // set default route
        this.changePage('home');
    }

    static get observedAttributes() {
        return ["page"];
    }

    // callback when changes are made to logged
    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === newValue) return; 
        if (name === 'page') {
            this.pageUpdated(newValue);
        }
    }

    pageUpdated(page) {
        // if logged in, tell navbar to update menu by changing attribute
        this.token = localStorage.getItem('simple-stocks-jwt');

        // determine auth status (still evaluated with each request)
        if(this.token) {
            this.loggedIn = true;
            const navbar = this.shadowRoot.querySelector('stock-navbar');
            navbar.setAttribute('logged', 'true');
        }

        // log user out
        if(page === 'logout') {
            localStorage.removeItem('simple-stocks-jwt');
            const navbar = this.shadowRoot.querySelector('stock-navbar');
            navbar.removeAttribute('logged');
            page = 'home';
        }
        this.changePage(page);
    }

    initializeRouter() {
        // listen for the user to click browser buttons, use history to navigate them around
        window.addEventListener('popstate', (e) => {
            this.changeRoute(e.state.page);
        });
    }

    changePage(page) {
        // no trailing slash
        let ROOT_URL = '/projects/simple-stocks';

        switch(page) {
            case 'login':
                this.appRoot.innerHTML = `<stock-pages-login></stock-pages-login>`;
                history.pushState({page: 'login'}, '', `${ROOT_URL}/login`);
                break;               
            case 'signup':
                this.appRoot.innerHTML = `<stock-pages-signup></stock-pages-signup>`;
                history.pushState({page: 'signup'}, '', `${ROOT_URL}/signup`);
                break;
            case 'add':
                this.appRoot.innerHTML = `<stock-pages-add></stock-pages-add>`;
                history.pushState({page: 'add'}, '', `${ROOT_URL}/add`);
                break;
            case 'signup':
                this.appRoot.innerHTML = `<stock-pages-signup></stock-pages-signup>`;
                history.pushState({page: 'signup'}, '', `${ROOT_URL}/signup`);
                break;
            case 'profile':
                this.appRoot.innerHTML = `<stock-pages-profile></stock-pages-profile>`;
                history.pushState({page: 'profile'}, '', `${ROOT_URL}/profile`);
                break;
            case 'profile-password':
                this.appRoot.innerHTML = `<stock-pages-profile-password></stock-pages-profile-password>`;
                history.pushState({page: 'profile-password'}, '', `${ROOT_URL}/profile/password`);
                break;
            case 'profile-username':
                this.appRoot.innerHTML = `<stock-pages-profile-username></stock-pages-profile-username>`;
                history.pushState({page: 'profile-username'}, '', `${ROOT_URL}/profile/username`);
                break;
            default: 
                this.appRoot.innerHTML = `<stock-pages-home></stock-pages-home>`;
                history.pushState({page: 'home'}, '', `${ROOT_URL}/`);
                break;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" type="text/css" href="./css/styles.css">
        
        <div class="header">
            <h3>Simple Stocks</h3>
            <stock-navbar logged="false">
            </stock-navbar>
        </div>

        <div class="pageHeader" title="Portfolio value">
        <!--Total value goes here-->
        </div>

        <div class="content">
        <!-- STOCK CARDS GO HERE -->
        </div>
    `;
    }
}