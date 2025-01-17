document.addEventListener('DOMContentLoaded', () => {
    // --- Ciclo de imágenes de fondo ---
    const imagenes = [
        'imagenes/fondos/IASETUP2.webp',
        'imagenes/fondos/IASETUP3.webp',
        'imagenes/fondos/IASETUP4.webp',
        'imagenes/fondos/IASETUP6.webp',
        'imagenes/fondos/IASETUP5.webp',
        'imagenes/fondos/IASETUP1.webp',
        'imagenes/fondos/IASETUP7.webp',
        'imagenes/fondos/IASETUP8.webp',
        'imagenes/fondos/IASETUP9.webp',
    ];
    let indice = 0;

    const cambiarImagen = () => {
        const contenedorImagen = document.getElementById('containerPrincipal__img');
        if (contenedorImagen) {
            contenedorImagen.style.backgroundImage = `url(${imagenes[indice]})`;
            indice = (indice + 1) % imagenes.length;
        }
    };

    setInterval(cambiarImagen, 10000);
    cambiarImagen();

    // --- Animación de parpadeo del botón ---
    const link = document.querySelector('.containerPrincipal__down');

    if (link) {
        const triggerAnimation = () => {
            link.classList.add('link-grow-twice');
            setTimeout(() => link.classList.remove('link-grow-twice'), 800);
        };

        setInterval(triggerAnimation, 5000);
    }

    // --- Carrusel ---
    const next = document.querySelector('.button .next');
    const prev = document.querySelector('.button .prev');
    const slide = document.querySelector('.slide');

    const updateActiveItem = () => {
        const items = slide ? slide.querySelectorAll('.item') : [];
        items.forEach(item => item.classList.remove('active'));
        if (items.length > 1) items[1].classList.add('active'); // Segundo elemento es el principal
    };

    if (next && prev && slide) {
        next.addEventListener('click', () => {
            const items = slide.querySelectorAll('.item');
            if (items.length) {
                slide.appendChild(items[0]);
                updateActiveItem();
            }
        });

        prev.addEventListener('click', () => {
            const items = slide.querySelectorAll('.item');
            if (items.length) {
                slide.prepend(items[items.length - 1]);
                updateActiveItem();
            }
        });

        // Inicializa la clase activa
        updateActiveItem();
    }

    // --- Gestión de categorías ---
    const botonesCategoria = document.querySelectorAll('.contenedorCentralButton');

    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoriaId = boton.dataset.categoria; // Mejor uso de `dataset`
            localStorage.setItem('categoriaSeleccionada', categoriaId);
            window.location.href = 'catalogo.html';
        });
    });
});
