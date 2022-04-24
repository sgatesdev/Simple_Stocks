 /**
 * Password change page
 */

  import * as Utilities from "../../utils.js";

  export default class ProfilePassword extends HTMLElement {
    constructor() {
        super();

        // create shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // grab token from local storage to authenticate request 
        this.token = localStorage.getItem('simple-stocks-jwt');

        // render form
        this.render();

        // create vars for parts of shadowDOM after it is rendered
        this.errorContainer = this.shadowRoot.querySelector('#error');

        const updateBtn = this.shadowRoot.querySelector('#btn-update');
        updateBtn.addEventListener('click', (e) => this.onSubmit(e));

        const cancelBtn = this.shadowRoot.querySelector('#btn-cancel');
        cancelBtn.addEventListener('click', (e) => Utilities.changePage('profile'));
    }

    disconnectedCallback() {
        const form = this.shadowRoot.querySelector('#profileForm');
        form.removeEventListener('submit', this.onSubmit);
    }

    onSubmit(e) {
        e.preventDefault();

        //get inputs, including values, from DOM 
        this.password = this.shadowRoot.getElementById('password').value;
        this.current_password = this.shadowRoot.getElementById('current_password').value;

        let confirm = this.shadowRoot.getElementById('confirm').value;


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
        this.editUser();
    }

    async editUser() {
        // put data into var to send 
        let updateUser = {
            password: this.password,
            current_password: this.current_password
        };
        
        // save updates to user
        let res = await fetch(`${Utilities.API_ROOT}/user/edit/password/`, {
            method: 'PUT',
            headers: Utilities.getDefaultHeaders(this.token),
            body: JSON.stringify(updateUser)
        });

        let fullResponse = await res.json();

        if(fullResponse.message) {
            this.errorContainer.innerHTML = fullResponse.message;
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
            <button type="submit" id="btn-update">Update</button>
            <button type="cancel" id="btn-cancel">Cancel</button>
        </form>
        <p id="error"></p>
        `;
    }
  }
  
  window.customElements.define('stock-pages-profile-password', ProfilePassword);