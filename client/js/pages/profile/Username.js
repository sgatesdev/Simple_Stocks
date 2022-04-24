 /**
 * Username/Email update page
 */
 
  import * as Utilities from "../../utils.js";

  export default class ProfileUsername extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // grab token from local storage to authenticate request 
        this.token = localStorage.getItem('simple-stocks-jwt');

        if (!this.token) {
            return;
        }

        // grab user info from server 
        let userInfo = await Utilities.getMe(this.token);
        if (userInfo.message) {
            // user somehow got here without being logged in
            return Utilities.changePage('home');   
        }

        this.username = userInfo.username;
        this.email = userInfo.email;

        // render form
        this.render();

        // create vars for parts of shadowDOM after it is rendered
        this.errorContainer = this.shadowRoot.querySelector('#error');

        const saveBtn = this.shadowRoot.querySelector('#btn-save');
        saveBtn.addEventListener('click', (e) => this.onSubmit(e));

        const cancelBtn = this.shadowRoot.querySelector('#btn-cancel');
        cancelBtn.addEventListener('click', () => Utilities.changePage('profile'));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#profileForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    onSubmit(e) {
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
        this.editUser();
    }

    async editUser() {
        // put data into var to send 
        let updateUser = {
            username: this.username,
            email: this.email,
            current_password: this.current_password
        };
        
        // save updates to user
        let res = await fetch(`${Utilities.API_ROOT}/user/edit/profile/`, {
            method: 'PUT',
            headers: Utilities.getDefaultHeaders(this.token),
            body: JSON.stringify(updateUser)
        });
        let data = await res.json();

        if(data.message) {
            this.errorContainer.innerHTML = data.message;
        } 
        else {
            Utilities.changePage('profile');
        }
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

            #profileForm div {
                margin: 5px 0px; 
            }

            #error {
                margin: 0px;
                padding-top: 5px;
                color: red;
                width: 200px;
            }
        </style>
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
            <button id="btn-save" type="submit">Save</button>
            <button id="btn-cancel" type="submit">Cancel</button>
        </form>
        <p id="error"></p>
        `;
    }
  }
  
  window.customElements.define('stock-pages-profile-username', ProfileUsername);