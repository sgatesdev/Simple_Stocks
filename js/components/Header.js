export default class Header extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="header">
            <h3>Simple Stocks</h3>
            <stock-navbar>
            </stock-navbar>
            </div>
        `;
    }
}