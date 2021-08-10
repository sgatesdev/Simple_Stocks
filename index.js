// bring in different pages

import Home from './js/pages/Home.js';
import AddStockForm from './js/components/addStockForm.js';

window.customElements.define('stock-form', AddStockForm);

const router = new Navigo('/');
const docRoot = document.querySelector('.content');

console.log(router)

router
    .on('/', function () {
        docRoot.replaceChildren(Home);
    })
    .on('/add', () => {
        document.querySelector('.warning').innerHTML = ``;
        docRoot.innerHTML = `<stock-form></stock-form>`;    
    })
    .resolve();

