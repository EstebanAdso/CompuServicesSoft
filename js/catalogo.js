// Importar baseURL desde config.js
import { baseURL } from './config.js';

// Endpoints dinámicos
const ApiProducto = `${baseURL}/producto`;
const ApiCategoria = `${baseURL}/categoria`;

// Exclusión de categorías
const categoriasExcluidas = [7, 9, 13, 24, 25, 26, 29, 30, 32, 33];

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const categoriaSlug = params.get('categoria') || localStorage.getItem('categoriaSeleccionada');
    try {
        const categorias = await listarCategorias();
        const tituloCategoria = document.querySelector('#categoria-titulo');

        if (categoriaSlug) {
            const categoria = categorias.find(cat => slugify(cat.nombre) === categoriaSlug);
            if (categoria) {
                tituloCategoria.textContent = `Catálogo de ${capitalize(categoria.nombre)}`;
                await listarProductosPorCategoria(categoria.id);
            } else {
                tituloCategoria.textContent = 'Todas las Categorías';
                await listarProductos();
            }
        } else {
            tituloCategoria.textContent = 'Todas las Categorías';
            await listarProductos();
        }

        const contenedorCentral = document.getElementById('contenedorCentral');
        contenedorCentral.parentNode.insertBefore(tituloCategoria, contenedorCentral);
    } catch (error) {
        console.error('Error al inicializar:', error);
    } finally {
        localStorage.removeItem('categoriaSeleccionada');
    }
});

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function listarCategorias() {
    const ulElement = document.querySelector(".content__products__sidebar ul");
    try {
        const response = await fetch(ApiCategoria);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const categorias = await response.json();
        ulElement.innerHTML = "";

        ulElement.appendChild(crearCategoriaEnlace("TODOS", null, () => {
            history.pushState(null, '', window.location.pathname);
            listarProductos();
        }));

        categorias.filter(categoria => !categoriasExcluidas.includes(categoria.id))
            .forEach(categoria => {
                ulElement.appendChild(crearCategoriaEnlace(categoria.nombre, categoria.id, () => {
                    const slug = slugify(categoria.nombre);
                    history.pushState(null, '', `?categoria=${slug}`);
                    listarProductosPorCategoria(categoria.id);
                }));
            });

        return categorias;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        return [];
    }
}

function crearCategoriaEnlace(nombre, id, onClick) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = nombre;
    link.href = id ? `?categoria=${slugify(nombre)}` : "#";
    link.setAttribute('aria-label', `Filtrar por ${nombre}`);
    link.addEventListener('click', event => {
        event.preventDefault();
        const tituloCategoria = document.getElementById('categoria-titulo');
        tituloCategoria.textContent = nombre === 'TODOS' ? 'Todas las Categorías' : `Catálogo de ${capitalize(nombre)}`;
        document.querySelectorAll(".content__products__sidebar ul a").forEach(a => a.classList.remove('selected'));
        link.classList.add('selected');
        onClick();
    });
    li.appendChild(link);
    return li;
}

async function listarProductos() {
    try {
        const response = await fetch(ApiProducto);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const productos = await response.json();
        renderizarProductos(productos.filter(producto => !categoriasExcluidas.includes(producto.categoria?.id)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error al listar productos:', error);
    }
}

async function listarProductosPorCategoria(categoriaId) {
    const contenedor = document.getElementById('contenedorCentral');
    try {
        if (contenedor.dataset.categoriaId === categoriaId) return;
        const response = await fetch(`${ApiProducto}/categoria/${categoriaId}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const productos = await response.json();
        contenedor.dataset.categoriaId = categoriaId;
        renderizarProductos(productos);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error(`Error al listar productos de la categoría ${categoriaId}:`, error);
    }
}

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

function cerrarModal(modal) {
    modal.style.display = 'none';
    modal.remove();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
