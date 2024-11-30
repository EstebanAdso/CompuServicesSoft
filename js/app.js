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


    document.addEventListener('DOMContentLoaded', () => {
            const carrusel = document.querySelector('.carrusel');
            const productos = document.querySelectorAll('.producto');
            const flechaIzquierda = document.querySelector('.flecha-izquierda');
            const flechaDerecha = document.querySelector('.flecha-derecha');
            let indiceActual = 2; // Producto 3 está inicialmente activo

            function actualizarCarrusel() {
                productos.forEach((producto, index) => {
                    producto.classList.remove('activo', 'cercano');
                    
                    if (index === indiceActual) {
                        producto.classList.add('activo');
                    }
                    
                    if (index === indiceActual - 1 || index === indiceActual + 1) {
                        producto.classList.add('cercano');
                    }
                });
            }

            flechaDerecha.addEventListener('click', () => {
                if (indiceActual < productos.length - 1) {
                    indiceActual++;
                    actualizarCarrusel();
                }
            });

            flechaIzquierda.addEventListener('click', () => {
                if (indiceActual > 0) {
                    indiceActual--;
                    actualizarCarrusel();
                }
            });
        });

