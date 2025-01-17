// Importar baseURL desde config.js
import { baseURL } from './config.js';

// Endpoints dinámicos
const ApiProducto = `${baseURL}/producto`;
const ApiCategoria = `${baseURL}/categoria`;

// Exclusión de categorías
const categoriasExcluidas = [7, 9, 13, 24, 25, 26, 29, 30, 32, 33];

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria') || localStorage.getItem('categoriaSeleccionada');

    // Configurar el evento para cerrar la notificación
    const cerrarBtn = document.querySelector('.btn-cerrar');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            const notificacion = document.getElementById("notificacion");
            if (notificacion) {
                notificacion.style.transition = "opacity 0.5s ease";
                notificacion.style.opacity = "0"; // Animación de desvanecimiento
                setTimeout(() => notificacion.remove(), 500); // Eliminar del DOM después de la animación
            }
        });
    }

    try {
        // Inicializar categorías y productos
        await listarCategorias();
        categoriaId ? await listarProductosPorCategoria(categoriaId) : await listarProductos();
    } catch (error) {
        console.error('Error al inicializar:', error);
    } finally {
        // Limpiar localStorage
        localStorage.removeItem('categoriaSeleccionada');
    }
});


// Función para listar categorías
async function listarCategorias() {
    const ulElement = document.querySelector(".content__products__sidebar ul");
    try {
        const response = await fetch(ApiCategoria);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const categorias = await response.json();

        ulElement.innerHTML = "";

        // Agregar la opción "TODOS"
        ulElement.appendChild(crearCategoriaEnlace("TODOS", null, listarProductos));

        // Filtrar y listar categorías
        categorias
            .filter(categoria => !categoriasExcluidas.includes(categoria.id))
            .forEach(categoria => {
                ulElement.appendChild(crearCategoriaEnlace(categoria.nombre, categoria.id, () => listarProductosPorCategoria(categoria.id)));
            });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Crear enlace para cada categoría
function crearCategoriaEnlace(nombre, id, onClick) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = nombre;
    link.href = "#";
    link.setAttribute('aria-label', `Filtrar por ${nombre}`);
    link.addEventListener('click', event => {
        event.preventDefault();
        document.querySelectorAll(".content__products__sidebar ul a").forEach(a => a.classList.remove('selected'));
        link.classList.add('selected');
        onClick();
    });
    li.appendChild(link);
    return li;
}

// Función para listar productos
async function listarProductos() {
    try {
        const response = await fetch(ApiProducto);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const productos = await response.json();
        renderizarProductos(productos.filter(producto => !categoriasExcluidas.includes(producto.categoria?.id)));
    } catch (error) {
        console.error('Error al listar productos:');
    }
}

// Función para listar productos por categoría
async function listarProductosPorCategoria(categoriaId) {
    const contenedor = document.getElementById('contenedorCentral');
    try {
        if (contenedor.dataset.categoriaId === categoriaId) return;
        const response = await fetch(`${ApiProducto}/categoria/${categoriaId}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const productos = await response.json();
        contenedor.dataset.categoriaId = categoriaId;
        renderizarProductos(productos);
    } catch (error) {
        console.error(`Error al listar productos de la categoría ${categoriaId}:`);
    }
}

// Renderizar productos en el DOM
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedorCentral');
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const button = document.createElement('button');
        button.classList.add('contenedorCentral_carta');
        button.innerHTML = `
            <div class="contenedorCentral__catalogoImagen">
                <div class="contenedorCentral_img">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="contenedorCentral_content">
                    <h3>${capitalize(producto.nombre)}</h3>
                    <span class="spanPrecio">$ ${formatNumber(producto.precioVendido)}</span>
                    <button class="verDetalles" aria-label="Ver detalles de ${producto.nombre}">Ver Detalles</button>
                </div>
            </div>
        `;
        button.querySelector('.verDetalles').addEventListener('click', () => mostrarModal(producto));
        contenedor.appendChild(button);
    });
}

// Mostrar modal con detalles del producto
function mostrarModal(producto) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" aria-label="Cerrar">&times;</span>
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" alt="${producto.nombre}" class="modal-image">
            <p>${producto.descripcion || 'No hay descripción para este producto.'}</p>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    const closeModal = modal.querySelector('.close');
    closeModal.addEventListener('click', () => cerrarModal(modal));
    window.addEventListener('click', event => {
        if (event.target === modal) cerrarModal(modal);
    });
}

// Cerrar el modal
function cerrarModal(modal) {
    modal.style.display = 'none';
    modal.remove();
}

// Utilidades
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
