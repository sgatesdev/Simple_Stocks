 /**
 * Page to handle adding a stock
 */
 
  export default class Profile extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // grab token from local storage to authenticate request 
        this.token = localStorage.getItem('simple-stocks-jwt');

        // grab user info from server 
        let res = await fetch(`http://localhost:3001/user/me/`, {
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
        this.password = this.shadowRoot.getElementById('password').value;
        this.current_password = this.shadowRoot.getElementById('current_password').value;

        let confirm = this.shadowRoot.getElementById('confirm').value;

        if(this.username === '') {
            return this.errorContainer.innerHTML = 'Please enter a username';
        }

        if(this.email === '') {
            return this.errorContainer.innerHTML = 'Please enter an email';
        }

        if(this.password === '') {
            return this.errorContainer.innerHTML = 'Please enter a password';
        }

        if(this.current_password === '') {
            return this.errorContainer.innerHTML = 'Please enter a password';
        }

        if(confirm === '') {
            return this.errorContainer.innerHTML = 'Please enter password again';
        }

        if(this.password !== confirm) {
            return this.errorContainer.innerHTML = 'Please enter matching passwords';
        }

        // validation passed, create user
        this._editUser();
    }

    async _editUser() {
        // put data into var to send 
        let updateUser = {
            username: this.username,
            email: this.email,
            password: this.password,
            current_password: this.current_password
        };

        console.log(updateUser)
        
        // save updates to user
        let res = await fetch('http://localhost:3001/user/edit/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUser)
        });
        
        if(res.ok) {
            let fullResponse = await res.json();

            console.log(fullResponse);

            this._navigate();  
        } 
        else {
            this.errorContainer.innerHTML = 'There was an error editing user';
        }
    }

    _navigate() {
        let navigateEvent = new CustomEvent("route-change", {
            bubbles: true,
            detail: { route: 'home' }
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
                <div>Current password</div>
                <div>
                <input type="password" name="current_password" placeholder="New Password" id="current_password">
                </div>
            </div>
            <div>
                <div>New password</div>
                <div>
                <input type="password" name="password" placeholder="New Password" id="password">
                </div>
            </div>
            <div>
                <div>Confirm</div>
                <div>
                <input type="password" name="confirm" placeholder="Confirm" id="confirm">
                </div>
            </div>
            <button type="submit">Sign Up!</button>
        </form>
        `;
    }
  }
  
  window.customElements.define('stock-pages-profile', Profile);