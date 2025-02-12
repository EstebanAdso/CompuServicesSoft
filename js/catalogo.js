// Importar baseURL desde config.js
import { baseURL } from './config.js';

// Endpoints dinámicos
const ApiProducto = `${baseURL}/producto`;
const ApiCategoria = `${baseURL}/categoria`;

// Exclusión de categorías
const categoriasExcluidas = [7, 9, 13, 24, 25, 26, 29, 30, 32, 33];

// Variables de paginación
let productosPaginados = [];
let paginaActual = 1;
const productosPorPagina = 32; 

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const categoriaSlug = params.get('categoria') || localStorage.getItem('categoriaSeleccionada');
    try {
        const categorias = await listarCategorias();
        const tituloCategoria = document.querySelector('#categoria-titulo');

        if (categoriaSlug) {
            const categoria = categorias.find(cat => slugify(cat.nombre) === categoriaSlug);
            if (categoria) {
                tituloCategoria.textContent = `Catálogo de ${categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1).toLowerCase()}`;
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
    
    // Verificar si la categoría está seleccionada
    const params = new URLSearchParams(window.location.search);
    const categoriaSlug = params.get('categoria');
    if ((categoriaSlug && slugify(nombre) === categoriaSlug) || (!categoriaSlug && nombre === 'TODOS')) {
        link.classList.add('selected');
    }

    link.addEventListener('click', event => {
        event.preventDefault();
        const tituloCategoria = document.getElementById('categoria-titulo');
        tituloCategoria.textContent = nombre === 'TODOS' ? 'Todos' : `Catálogo de ${nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()}`;
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
        
        productosPaginados = productos.filter(producto => !categoriasExcluidas.includes(producto.categoria?.id));
        paginaActual = 1;
        renderizarProductos();
    } catch (error) {
        console.error('Error al listar productos:', error);
    }
}

async function listarProductosPorCategoria(categoriaId) {
    try {
        const response = await fetch(`${ApiProducto}/categoria/${categoriaId}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const productos = await response.json();

        productosPaginados = productos;
        paginaActual = 1;
        renderizarProductos();
    } catch (error) {
        console.error(`Error al listar productos de la categoría ${categoriaId}:`, error);
    }
}

function renderizarProductos() {
    const contenedor = document.getElementById('contenedorCentral');
    contenedor.innerHTML = "";

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosPaginados.slice(inicio, fin);

    productosPagina.forEach(producto => {
        const button = document.createElement('button');
        button.classList.add('contenedorCentral_carta');
        button.innerHTML = `
            <div class="contenedorCentral__catalogoImagen">
                <div class="contenedorCentral_img">
                    <img data-src="${producto.imagen}" alt="${producto.nombre}" class="lazy-image">
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

    aplicarLazyLoading();
    renderizarPaginacion();
}

function aplicarLazyLoading() {
    const images = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}


function renderizarPaginacion() {
    const contenedor = document.getElementById('contenedorCentral');
    let paginacion = document.getElementById('paginacion');

    if (!paginacion) {
        paginacion = document.createElement('div');
        paginacion.id = 'paginacion';
        paginacion.classList.add('paginacion');
        contenedor.parentNode.appendChild(paginacion);
    }

    const totalPaginas = Math.ceil(productosPaginados.length / productosPorPagina);
    if (totalPaginas <= 1) {
        paginacion.innerHTML = "";
        return;
    }

    paginacion.innerHTML = `
        ${paginaActual > 1 ? '<button id="btnAnterior">Anterior</button>' : ''}
        <span>Página ${paginaActual} de ${totalPaginas}</span>
        ${paginaActual < totalPaginas ? '<button id="btnSiguiente">Siguiente</button>' : ''}
    `;

    if (paginaActual > 1) {
        document.getElementById('btnAnterior').addEventListener('click', () => {
            paginaActual--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            renderizarProductos();
        });
    }

    if (paginaActual < totalPaginas) {
        document.getElementById('btnSiguiente').addEventListener('click', () => {
            paginaActual++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            renderizarProductos();
        });
    }
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
