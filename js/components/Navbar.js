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

            a {
                text-decoration: none;
                color: white;
                font-weight: bold;
            }

            a:hover {
                color: black;
            }
        </style>

        <div class="navbar">
        <ul>
            <li>
                <a href="#" id="nav-home">Home</a> |
            </li>
            <li>
                <a href="#" id="nav-add">Add Stock</a> |
            </li>
            <li>
                <a href="/">Sign up</a> |
            </li>
            <li>
                <a href="/">Log in</a> |
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
        this.testEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: page }
        });
        this.dispatchEvent(this.testEvent);
    }

}

window.customElements.define('stock-navbar', Navbar);