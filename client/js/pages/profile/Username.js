 /**
 * Username/Email update page
 */
 
  import { BACKEND_URL } from '../../config.js';

  export default class ProfileUsername extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // grab token from local storage to authenticate request 
        this.token = localStorage.getItem('simple-stocks-jwt');

        // grab user info from server 
        let res = await fetch(`${BACKEND_URL}/user/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        let data = await res.json();

        this.username = data.username;
        this.email = data.email;

        // render form
        this._renderForm();

        // create vars for parts of shadowDOM after it is rendered
        this.errorContainer = this.shadowRoot.querySelector('#error');

        const form = this.shadowRoot.querySelector('#profileForm');
        form.addEventListener('submit', (e) => this._onSubmit(e));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#profileForm');
        form.removeEventListener('submit', this._onSubmit);
    }

    _onSubmit(e) {
        e.preventDefault();

        //get inputs, including values, from DOM 
        this.username = this.shadowRoot.getElementById('username').value;
        this.email = this.shadowRoot.getElementById('email').value;
        this.current_password = this.shadowRoot.getElementById('password').value;

        if(this.username === '') {
            return this.errorContainer.innerHTML = 'Please enter a username';
        }

        if(this.email === '') {
            return this.errorContainer.innerHTML = 'Please enter an email';
        }

        if(this.current_password === '') {
            return this.errorContainer.innerHTML = 'Please enter your password';
        }

        // validation passed, create user
        this._editUser();
    }

    async _editUser() {
        // put data into var to send 
        let updateUser = {
            username: this.username,
            email: this.email,
            current_password: this.current_password
        };
        
        // save updates to user
        let res = await fetch(`${BACKEND_URL}/user/edit/profile/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUser)
        });
        
        let fullResponse = await res.json();

        if(fullResponse.message) {
            this.errorContainer.innerHTML = fullResponse.message;
        } 
        else {
            this._navigate();  
        }
    }

    _navigate() {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'profile' }
        });
        this.dispatchEvent(navigateEvent);
    }

    _renderForm() {
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

            #profileForm div {
                margin: 5px 0px; 
            }

            #error {
                margin: 0px;
                padding-top: 5px;
                color: red;
                width: 100%;
                text-align: center;
            }
        </style>
        <p id="error"></p>
        <form action="#" id="profileForm">
            <div>
                <div>Username</div>
                <div>
                <input type="text" name="username" value="${this.username}" id="username">
                </div>
            </div>
            <div>
                <div>Email</div>
                <div>
                <input type="text" name="email" value="${this.email}" id="email">
                </div>
            </div>
            <div>
                <div>Password</div>
                <div>
                <input type="password" name="password" placeholder="Password" id="password">
                </div>
            </div>
            <button type="submit">Save</button>
        </form>
        `;
    }
  }
  
  window.customElements.define('stock-pages-profile-username', ProfileUsername);