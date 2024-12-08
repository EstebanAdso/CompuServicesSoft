var imagenes = [
    'imagenes/fondos/pc-gaming-setup-rgb-4k-ft1ym37yjyb7lp19.jpg',
    'imagenes/fondos/set2.jpg',
    'imagenes/fondos/set3.jpg',
    'imagenes/fondos/set4.jpg',
    'imagenes/fondos/set5.jpg',
    'imagenes/fondos/set6.jpg',
    'imagenes/fondos/setup.webp',
];

var indice = 1;


function cambiarImagen() {
    document.getElementById('containerPrincipal__img').style.backgroundImage = 'url(' + imagenes[indice] + ')';
    indice = (indice + 1) % imagenes.length;
}

setTimeout(() => {
    cambiarImagen()
}, 5000);


//Parpadear Boton De bajar
link = document.querySelector('.containerPrincipal__down'); 

function triggerAnimation() {
    link.classList.add('link-grow-twice');
    
    setTimeout(() => {
        link.classList.remove('link-grow-twice');
    }, 800); 
}
setInterval(triggerAnimation, 5000);


//CARRUSEL
let next = document.querySelector('.button .next')
let prev = document.querySelector('.button .prev')

next.addEventListener('click',function(){
    let items = document.querySelectorAll('.slide .item')
    document.querySelector('.slide').appendChild(items[0])
    
})

prev.addEventListener('click',function(){
    let items = document.querySelectorAll('.slide .item')
    document.querySelector('.slide').prepend(items[items.length - 1])
    
})

//Contacto Modal
const modalContacto = document.querySelector('.modalContacto')
const btnContacto = document.querySelector('#contactanos')
const btnCerrar = document.querySelector('#btnCerrar')

btnContacto.addEventListener('click', (e) => {
    e.preventDefault();
    modalContacto.style.display = 'flex';
});

btnCerrar.addEventListener('click', (e) =>{
    e.preventDefault()
    modalContacto.style.display = 'none'
})

document.querySelector('.header__menu').addEventListener('click', () => {
    const menu = document.querySelector('.header__lista');
    menu.classList.toggle('active'); // Alternar la clase "active"
});
