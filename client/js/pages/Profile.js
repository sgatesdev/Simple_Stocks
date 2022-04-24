 /**
 * Page to handle adding a stock
 */
 
 import * as Utilities from '../utils.js';

  export default class Profile extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
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
        this.shadowRoot.querySelector('#password').addEventListener('click', () => 
        Utilities.changePage('profile-password'));
        this.shadowRoot.querySelector('#username').addEventListener('click', () => Utilities.changePage('profile-username'));
    }
  }
  
  window.customElements.define('stock-pages-profile', Profile);