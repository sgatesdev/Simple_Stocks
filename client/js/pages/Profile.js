 /**
 * Page to handle adding a stock
 */
 
  import { BACKEND_URL } from '../config.js';

  export default class Profile extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        this._render();
    }

    _navigate(page) {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: page }
        });
        this.dispatchEvent(navigateEvent);
    }

    _render() {
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

            div {
                margin: 5px 0px; 
            }
        </style>
        <div style="text-align: center">
        <div>
            <button id="password">Change Password</button>
        </div>
        <div>
            <button id="username">Change Username and Email</button>
        </div>
        </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#password').addEventListener('click', () => this._navigate('profile-password'));

        this.shadowRoot.querySelector('#username').addEventListener('click', () => this._navigate('profile-username'));
    }
  }
  
  window.customElements.define('stock-pages-profile', Profile);