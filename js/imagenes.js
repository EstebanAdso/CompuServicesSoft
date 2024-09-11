
var imagenes = [
    'imagenes/pc-gaming-setup-rgb-4k-ft1ym37yjyb7lp19.jpg',
    'imagenes/set2.jpg',
    'imagenes/set3.jpg',
    'imagenes/set4.jpg',
    'imagenes/set5.jpg',
    'imagenes/set6.jpg',
    'imagenes/setup.webp',
];

// Índice de la imagen actual
var indice = 1;

// Función para cambiar la imagen cada 10 segundos
function cambiarImagen() {
    // Actualiza la URL de la imagen de fondo del div
    document.getElementById('containerPrincipal__img').style.backgroundImage = 'url(' + imagenes[indice] + ')';
    
    // Incrementa el índice para mostrar la próxima imagen
    indice = (indice + 1) % imagenes.length;
   
}

// Llama a la función cambiarImagen cada 10 segundos
setInterval(cambiarImagen, 10000); // 10000 milisegundos = 10 segundos

document.addEventListener('DOMContentLoaded', function() {
    var miModal = document.getElementById('miModal');
    miModal.classList.add('modal-abierto'); // Agregar la clase para activar la transición
});


