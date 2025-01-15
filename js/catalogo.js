// Configuración de la URL base para manejar entornos local y producción
const baseURL = window.location.hostname.includes('localhost')
    ? 'http://localhost:8084'
    : 'https://imaginative-charisma-production.up.railway.app';

// Endpoints dinámicos
const ApiProducto = `${baseURL}/producto`;
const ApiCategoria = `${baseURL}/categoria`;

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
                            <button class="verDetalles">Ver Detalles</button>
                        </div>
                    </div>
                `;

                // Añadir el producto al contenedor
                contenedor.appendChild(button);

                // Evento click para mostrar la descripción del producto
                const verDetallesBtn = button.querySelector('.verDetalles');
                verDetallesBtn.addEventListener('click', () => {
                    // Crear el modal
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    
                    // Contenido del modal
                    modal.innerHTML = `
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2>${producto.nombre}</h2>
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="modal-image">
                            <p>${producto.descripcion ? producto.descripcion : 'No hay descripción para este producto.'}</p>
                        </div>
                    `;

                    // Añadir el modal al body
                    document.body.appendChild(modal);

                    // Mostrar el modal
                    modal.style.display = 'block';

                    // Cerrar el modal al hacer clic en el botón de cerrar
                    const closeModal = modal.querySelector('.close');
                    closeModal.addEventListener('click', () => {
                        modal.style.display = 'none';
                        modal.remove();
                    });

                    // Cerrar el modal al hacer clic fuera del contenido del modal
                    window.addEventListener('click', (event) => {
                        if (event.target === modal) {
                            modal.style.display = 'none';
                            modal.remove();
                        }
                    });
                });
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
                            <button class="verDetalles">Ver Detalles</button>
                        </div>
                    </div>
                `;

                contenedor.appendChild(button);

                // Evento click para mostrar la descripción del producto
                const verDetallesBtn = button.querySelector('.verDetalles');
                verDetallesBtn.addEventListener('click', () => {
                    // Crear el modal
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    
                    // Contenido del modal
                    modal.innerHTML = `
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2>${producto.nombre}</h2>
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="modal-image">
                            <p>${producto.descripcion ? producto.descripcion : 'No hay descripción para este producto.'}</p>
                        </div>
                    `;

                    // Añadir el modal al body
                    document.body.appendChild(modal);

                    // Mostrar el modal
                    modal.style.display = 'block';

                    // Cerrar el modal al hacer clic en el botón de cerrar
                    const closeModal = modal.querySelector('.close');
                    closeModal.addEventListener('click', () => {
                        modal.style.display = 'none';
                        modal.remove();
                    });

                    // Cerrar el modal al hacer clic fuera del contenido del modal
                    window.addEventListener('click', (event) => {
                        if (event.target === modal) {
                            modal.style.display = 'none';
                            modal.remove();
                        }
                    });
                });
            });

            // Desplazarse hasta arriba de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
