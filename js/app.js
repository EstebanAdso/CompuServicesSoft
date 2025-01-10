let imagenes = [
    'imagenes/fondos/pc-gaming-setup-rgb-4k-ft1ym37yjyb7lp19.jpg',
    'imagenes/fondos/set2.jpg',
    'imagenes/fondos/set3.jpg',
    'imagenes/fondos/set4.jpg',
    'imagenes/fondos/set5.jpg',
    'imagenes/fondos/set6.jpg',
    'imagenes/fondos/setup.webp',
];

let indice = 0; // Comenzamos desde el primer índice

function cambiarImagen() {
    document.getElementById('containerPrincipal__img').style.backgroundImage = 'url(' + imagenes[indice] + ')';
    indice = (indice + 1) % imagenes.length;
}

setInterval(cambiarImagen, 10000);
cambiarImagen();

// let textos = [
//     'Ven y cumple el sueño de todo Gamer!',
//     'Tu tienda de tecnología  de confianza',
//     'CompuServicesSoft:  Innovación para tu PC',
//     'Soluciones en productos  y mantenimiento de computadoras',
//     'Equipos y accesorios  para un rendimiento superior',
//     'CompuServicesSoft:  Todo en tecnología a tu alcance',
//     'Repara y mejora  tu PC con nosotros',
//     'La mejor tecnología para tu equipo',
//     'Asesoría, venta y reparación de computadoras',
//     'Potencia tu PC con nuestros productos y servicios',
//     'CompuServicesSoft: Expertos en tecnología y mantenimiento'
// ];


// let indiceTexto = 0

// function cambiarTexto(){
//     const parrafoPrincipal = document.querySelector('#parrafoPrincipal');
//     parrafoPrincipal.innerHTML = textos[indiceTexto]
//     indiceTexto = (indiceTexto + 1) % textos.length
// }
// setInterval(cambiarTexto, 10000)
// cambiarTexto()



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
let next = document.querySelector('.button .next');
let prev = document.querySelector('.button .prev');

function updateActiveItem() {
    let items = document.querySelectorAll('.slide .item');
    items.forEach(item => item.classList.remove('active')); // Quita la clase de todos los elementos
    items[1].classList.add('active'); // Asigna la clase al segundo elemento (imagen principal)
}

// Inicializa la clase activa en la carga de la página
updateActiveItem();

next.addEventListener('click', function () {
    let items = document.querySelectorAll('.slide .item');
    document.querySelector('.slide').appendChild(items[0]);
    updateActiveItem(); // Actualiza la clase activa después de cambiar
});

prev.addEventListener('click', function () {
    let items = document.querySelectorAll('.slide .item');
    document.querySelector('.slide').prepend(items[items.length - 1]);
    updateActiveItem(); // Actualiza la clase activa después de cambiar
});

