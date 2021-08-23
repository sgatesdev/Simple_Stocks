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

        this.token ? this._renderLogged() : this._renderDefault();
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

        // if value set to true, switch menus
        if(this.loggedIn) {
            this._renderLogged();
        }
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
            <span id="nav-login">Login</span>
        </li>
        </ul>
        `;

        // add event listeners for menu items
        this.shadowRoot.querySelector('#nav-home').addEventListener('click', () => this._navigate('home'));

        this.shadowRoot.querySelector('#nav-login').addEventListener('click', () => this._navigate('login'));
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
}

window.customElements.define('stock-navbar', Navbar);