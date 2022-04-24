import * as Utilities from "../utils.js";

export default class Navbar extends HTMLElement {
    constructor() {
        super();

        // create shadowDOM and render component shell
        this.attachShadow({ mode: 'open' });
        this.render();

        // set default for loggedIn (this toggles the menus)
        this.loggedIn = false;

        // default menu options 
        this.defaultMenuOptions = [
            { id: 'nav-home', text: 'Home', page: 'home' },
            { id: 'nav-login', text: 'Login', page: 'login' },
            { id: 'nav-signup', text: 'Sign Up', page: 'signup' }
        ];

        // authenticated options
        this.authMenuOptions = [
            { id: 'nav-home', text: 'Home', page: 'home' },
            { id: 'nav-add', text: 'Add Stock',page: 'add' },
            { id: 'nav-profile', text: 'Profile', page: 'profile' },
            { id: 'nav-logout', text: 'Log Out', page: 'logout' }
        ];
    }

    // when component loads, render default menu 
    connectedCallback() {
        this.token = localStorage.getItem('simple-stocks-jwt');
        this.checkToken();
    }

    // watch the logged attribute for changes
    // i learned that this is case sensitive, and components do not like camel casing
    // at least not in chrome
    static get observedAttributes() {
        return ["logged", "page"];
    }

    // callback when changes are made to logged
    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === newValue) return; 
        if (name === 'logged') {
            this.loggedIn = newValue;
            this.setNavOptions();
        }
    }


    // generate navigation menu links
    setNavOptions() {
        let options = !this.loggedIn ? this.defaultMenuOptions : this.authMenuOptions;
        let ulElement = document.createElement('ul');

        options.forEach(option => {
            let liElement = document.createElement('li');
            liElement.innerHTML = `<span id="${option.id}">${option.text}</span>`;
            liElement.addEventListener('click', () => Utilities.changePage(option.page));
            ulElement.append(liElement);
        });

        // set root for navbar to drop into
        let navContainer = this.shadowRoot.querySelector('.navbar');
        navContainer.innerHTML = '';
        navContainer.append(ulElement);
    }

    // render container for component w/ styling
    render() {
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

            @media only screen and (max-width: 573px) {
                ul {
                    display: block;
                }
            }
        </style>

        <div class="navbar">
        </div>    
        `;
        

    }

    async checkToken() {
        if (!this.token) {
            return;
        }

        // grab user info from server 
        let userInfo = await Utilities.getMe(this.token);

        // if there's a message...it's not valid 
        if(userInfo.message) {
            localStorage.removeItem('simple-stocks-jwt');
            this.loggedIn = false;
        }
        else {
            this.loggedIn = true;
        }
        this.setNavOptions();
    }
}

window.customElements.define('stock-navbar', Navbar);