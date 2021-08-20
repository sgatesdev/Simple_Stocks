export default class Navbar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
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

    connectedCallback() {
        this._render();

        this.shadowRoot.querySelector('#nav-home').addEventListener('click', () => this._navigate('home'));

        this.shadowRoot.querySelector('#nav-add').addEventListener('click', () => this._navigate('add'));

        this.shadowRoot.querySelector('#nav-login').addEventListener('click', () => this._navigate('login'));
    }

    _render() {
        const navList = this.shadowRoot.querySelector('.navbar');

        // AUTH LOGIC
        navList.innerHTML = `
        <ul>
        <li>
            <span id="nav-home">Home</span> |
        </li>
        <li>
            <span id="nav-login">Login</span> |
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
    }

    _navigate(page) {
        // figure out how to do this
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: page }
        });
        this.dispatchEvent(navigateEvent);
    }

}

window.customElements.define('stock-navbar', Navbar);