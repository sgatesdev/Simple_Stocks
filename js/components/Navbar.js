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
        <ul>
            <li>
                <span id="nav-home">Home</span> |
            </li>
            <li>
                <span id="nav-add">Add Stock</span> |
            </li>
            <li>
                <span id="nav-signup">Sign up</span> |
            </li>
            <li>
                <span id="nav-login">Log in</span> |
            </li>
            <li>
            <a href="/">Log out</a>
        </li>
        </ul>
        </div>    
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#nav-home').addEventListener('click', () => this._navigate('home'));

        this.shadowRoot.querySelector('#nav-add').addEventListener('click', () => this._navigate('add'));
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