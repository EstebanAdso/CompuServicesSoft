const ApiProducto = 'http://localhost:8084/producto';
const ApiCategoria = 'http://localhost:8084/categoria';

document.addEventListener('DOMContentLoaded', () => {
    listarProductos();
    listarCategorias();
});

// Función para listar todos los productos
function listarProductos() {
    fetch(ApiProducto)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('contenedorCentral');

            // Limpiar el contenedor antes de añadir los productos
            contenedor.innerHTML = '';

            // Iterar sobre los productos y crear los elementos HTML
            data.forEach(producto => {
                const button = document.createElement('button');
                button.classList.add('contenedorCentral_carta');

                // Estructura del contenido del producto
                button.innerHTML = `
                    <div class="contenedorCentral__catalogoImagen">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <h3>${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}</h3>
                    <span class="spanPrecio">$ ${formatNumber(producto.precioVendido)}</span>
                `;

                // Añadir el producto al contenedor
                contenedor.appendChild(button);
            });
        })
        .catch(error => {
            console.log('Error al traer los productos', error);
        });
}

// Función para listar categorías
function listarCategorias() {
    const ulElement = document.querySelector(".content__products__sidebar ul");

    // Función para cargar las categorías
    const loadCategorias = async () => {
        try {
            const response = await fetch(ApiCategoria);
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const categorias = await response.json();

            // Iterar sobre las categorías y crear los elementos <li> con enlaces
            categorias.forEach(categoria => {
                const li = document.createElement('li');
                const link = document.createElement('a');

                // Configurar el enlace
                link.textContent = categoria.nombre;
                link.href = "#"; // Prevenir redirección
                link.setAttribute('data-id', categoria.id);

                // Evento click para listar productos de la categoría
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    listarProductosPorCategoria(categoria.id);
                });

                li.appendChild(link);
                ulElement.appendChild(li);
            });
        } catch (error) {
            console.log('Error al cargar las categorías:', error);
        }
    };

    loadCategorias();
}

function listarProductosPorCategoria(categoriaId) {
    // Cambiar el endpoint al correcto
    const endpoint = `${ApiProducto}/categoria/${categoriaId}`;
    
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos para la categoría:", categoriaId, data); // Debugging

            // Verifica si la respuesta es un array
            if (!Array.isArray(data)) {
                throw new Error("La respuesta no es un array de productos.");
            }

            const contenedor = document.getElementById('contenedorCentral');

            // Limpiar el contenedor antes de añadir los productos
            contenedor.innerHTML = '';

            // Iterar sobre los productos y crear los elementos HTML
            data.forEach(producto => {
                const button = document.createElement('button');
                button.classList.add('contenedorCentral_carta');

                // Estructura del contenido del producto
                button.innerHTML = `
                    <div class="contenedorCentral__catalogoImagen">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <h3>${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}</h3>
                    <span class="spanPrecio">$ ${formatNumber(producto.precioVendido)}</span>
                `;

                // Añadir el producto al contenedor
                contenedor.appendChild(button);
            });
        })
        .catch(error => {
            console.error(`Error al listar productos de la categoría ${categoriaId}:`, error);
        });
}

function formatNumber(number) {
    return number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
