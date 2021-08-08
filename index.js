const router = new Navigo('/');
const docRoot = document.querySelector('.content');

console.log(router)

router.on('/', function () {
    docRoot.innerHTML = 'It works!';    
});

router.resolve();

