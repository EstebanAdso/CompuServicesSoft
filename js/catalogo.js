const ApiProducto = 'http://localhost:8084/producto';
const ApiCategoria = 'http://localhost:8084/categoria';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria');

    listarCategorias()

    if (categoriaId) {
        listarProductosPorCategoria(categoriaId);
    } else {
        listarProductos();
    }
});

function excluirCategorias() {
    return [7, 9, 13, 24, 25, 26, 29, 30, 32, 33];
}

// Función para listar todos los productos excluyendo ciertas categorías
function listarProductos() {
    const categoriasExcluidas = excluirCategorias(); // Obtener las categorías a excluir

    fetch(ApiProducto)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('contenedorCentral');

            // Limpiar el contenedor antes de añadir los productos
            contenedor.innerHTML = '';

            // Filtrar productos excluyendo las categorías no deseadas
            const productosFiltrados = data.filter(producto =>
                producto.categoria && !categoriasExcluidas.includes(producto.categoria.id)
            );

            // Iterar sobre los productos filtrados y crear los elementos HTML
            productosFiltrados.forEach(producto => {
                const button = document.createElement('button');
                button.classList.add('contenedorCentral_carta');

                // Estructura del contenido del producto
                button.innerHTML = `
                    <div class="contenedorCentral__catalogoImagen">
                        <div class="contenedorCentral_img">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <div class="contenedorCentral_content">
                            <h3>${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}</h3>
                            <span class="spanPrecio">$ ${formatNumber(producto.precioVendido)}</span>
                        </div>
                    </div>
                `;

                // Añadir el producto al contenedor
                contenedor.appendChild(button);
            });
        })
        .catch(error => {
            console.log('Error al traer los productos', error);
        });
}


// Función para listar categorías excluyendo ciertas categorías
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
            const categoriasExcluidas = excluirCategorias(); // Obtener categorías a excluir

            // Filtrar las categorías excluyendo las especificadas
            const categoriasFiltradas = categorias.filter(categoria =>
                !categoriasExcluidas.includes(categoria.id)
            );

            // Iterar sobre las categorías filtradas y crear los elementos <li> con enlaces
            categoriasFiltradas.forEach(categoria => {
                const li = document.createElement('li');
                const link = document.createElement('a');

                // Configurar el enlace
                link.textContent = categoria.nombre;
                link.href = "#"; // Prevenir redirección
                link.setAttribute('data-id', categoria.id);

                // Evento click para listar productos de la categoría y manejar la clase 'selected'
                link.addEventListener('click', (event) => {
                    event.preventDefault();

                    // Remueve la clase 'selected' de todos los enlaces
                    const allLinks = ulElement.querySelectorAll("a");
                    allLinks.forEach(link => link.classList.remove("selected"));

                    // Agrega la clase 'selected' al enlace clicado
                    link.classList.add("selected");

                    // Llama a la función para listar productos de la categoría seleccionada
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


// Función para listar productos por categoría excluyendo ciertas categorías
function listarProductosPorCategoria(categoriaId) {
    const endpoint = `${ApiProducto}/categoria/${categoriaId}`;

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const contenedor = document.getElementById('contenedorCentral');
            contenedor.innerHTML = ''; // Limpiar el contenedor

            data.forEach(producto => {
                const button = document.createElement('button');
                button.classList.add('contenedorCentral_carta');

                button.innerHTML = `
                    <div class="contenedorCentral__catalogoImagen">
                        <div class="contenedorCentral_img">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <div class="contenedorCentral_content">
                            <h3>${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}</h3>
                            <span class="spanPrecio">$ ${formatNumber(producto.precioVendido)}</span>
                        </div>
                    </div>
                `;

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



function cerrarNotificacion() {
    const notificacion = document.getElementById("notificacion");
    if (notificacion) {
        notificacion.style.transition = "opacity 0.5s ease";
        notificacion.style.opacity = "0"; // Animación de desvanecimiento
        setTimeout(() => notificacion.remove(), 500); // Eliminar del DOM después de la animación
    }
}
