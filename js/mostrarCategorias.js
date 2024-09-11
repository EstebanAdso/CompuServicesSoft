


document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8083/producto')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('contenedorCentral');

            // Limpiar el contenedor antes de añadir los productos
            contenedor.innerHTML = '';

            // Iterar sobre los productos y crear los elementos html
            data.forEach(producto => {
                const button = document.createElement('button');
                button.classList.add('contenedorCentral_carta');

                // Estructura del contenido del producto
                button.innerHTML = `
                    <div class="contenedorCentral__catalogoImagen">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <h3>${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}</h3>
                    <p>${producto.description}</p>
                `;

                // Añadimos el producto al contenedor
                contenedor.appendChild(button);
            });
        })
        .catch(error => {
            console.log('Error al traer los productos', error);
        });
});
