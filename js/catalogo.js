// Importar baseURL desde config.js
import { baseURL } from './config.js';

// Endpoints dinámicos
const ApiProducto = `${baseURL}/producto`;
const ApiCategoria = `${baseURL}/categoria`;

// Variables de paginación
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', async () => {
    // Reiniciar la página actual al cargar
    paginaActual = 1;
    const params = new URLSearchParams(window.location.search);
    const categoriaSlug = params.get('categoria') || localStorage.getItem('categoriaSeleccionada');
    try {
        const categorias = await listarCategorias();
        const tituloCategoria = document.querySelector('#categoria-titulo');

        if (categoriaSlug) {
            const categoria = categorias.find(cat => slugify(cat.nombre) === categoriaSlug);
            if (categoria) {
                // Actualizar metaetiquetas y título
                actualizarMetaEtiquetas(categoria);
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

// Función para actualizar metaetiquetas dinámicamente
function actualizarMetaEtiquetas(categoria) {
    const titulo = `CompuServicesSoft | Catálogo de ${categoria.nombre}`;
    const descripcion = `Explora nuestro catálogo de ${categoria.nombre} en CompuServicesSoft. Encuentra los mejores productos y ofertas.`;
    const canonicalUrl = `https://compuservicessoft.com/catalogo.html?categoria=${slugify(categoria.nombre)}`;

    // Actualizar título y metaetiquetas
    document.title = titulo;
    document.querySelector('meta[name="description"]').setAttribute('content', descripcion);
    document.querySelector('link[rel="canonical"]').setAttribute('href', canonicalUrl);

    // Actualizar Open Graph tags (opcional, si es necesario)
    document.querySelector('meta[property="og:title"]').setAttribute('content', titulo);
    document.querySelector('meta[property="og:description"]').setAttribute('content', descripcion);
    document.querySelector('meta[property="og:url"]').setAttribute('content', canonicalUrl);
}

// Función para convertir texto en slug
function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Función para listar categorías
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

        categorias.forEach(categoria => {
            ulElement.appendChild(crearCategoriaEnlace(categoria.nombre, categoria.id, () => {
                const slug = slugify(categoria.nombre);
                history.pushState(null, '', `?categoria=${slug}`);
                actualizarMetaEtiquetas(categoria); // Actualizar metaetiquetas
                listarProductosPorCategoria(categoria.id);
            }));
        });

        return categorias;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        return [];
    }
}

// Función para crear enlaces de categoría
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
        // Reiniciar la página actual al cambiar de categoría
        paginaActual = 1;
        const tituloCategoria = document.getElementById('categoria-titulo');
        tituloCategoria.textContent = nombre === 'TODOS' ? 'Todos' : `Catálogo de ${nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()}`;
        document.querySelectorAll(".content__products__sidebar ul a").forEach(a => a.classList.remove('selected'));
        link.classList.add('selected');
        onClick();
    });
    li.appendChild(link);
    return li;
}

// Función para listar todos los productos
async function listarProductos() {
    try {
        const response = await fetch(`${ApiProducto}?page=${paginaActual - 1}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const paginacion = await response.json();

        // Renderizar todos los productos sin filtrar
        renderizarProductos(paginacion.content);
        renderizarPaginacion(paginacion.totalPages);
    } catch (error) {
        console.error('Error al listar productos:', error);
    }
}

// Función para listar productos por categoría
async function listarProductosPorCategoria(categoriaId) {
    try {
        const response = await fetch(`${ApiProducto}/categoria/${categoriaId}?page=${paginaActual - 1}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const paginacion = await response.json();
        
        if (paginacion.content.length === 0) {
            const contenedor = document.getElementById('contenedorCentral');
            contenedor.innerHTML = '<p class="no-products">No se encontraron productos en esta categoría.</p>';
            return;
        }
        
        renderizarProductos(paginacion.content);
        renderizarPaginacion(paginacion.totalPages);
    } catch (error) {
        console.error(`Error al listar productos de la categoría ${categoriaId}:`, error);
        const contenedor = document.getElementById('contenedorCentral');
        contenedor.innerHTML = '<p class="error">Error al cargar los productos. Por favor, intente nuevamente.</p>';
    }
}

// Función para renderizar productos
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedorCentral');
    contenedor.innerHTML = "";

    productos.forEach(producto => {
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
}

// Función para renderizar la paginación
function renderizarPaginacion(totalPaginas) {
    let paginacion = document.getElementById('paginacion');

    if (!paginacion) {
        paginacion = document.createElement('div');
        paginacion.id = 'paginacion';
        paginacion.classList.add('paginacion');
        document.getElementById('contenedorCentral').after(paginacion);
    }

    if (totalPaginas <= 1) {
        paginacion.innerHTML = "";
        return;
    }

    paginacion.innerHTML = `
        <button id="btnAnterior" class="paginacion-btn" ${paginaActual === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="paginacion-info">Página ${paginaActual} de ${totalPaginas}</span>
        <button id="btnSiguiente" class="paginacion-btn" ${paginaActual === totalPaginas ? 'disabled' : ''}>Siguiente</button>
    `;

    document.getElementById('btnAnterior').addEventListener('click', async () => {
        if (paginaActual > 1) {
            paginaActual--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria');
            if (categoriaActual) {
                const categorias = await listarCategorias();
                const categoria = categorias.find(cat => slugify(cat.nombre) === categoriaActual);
                if (categoria) {
                    await listarProductosPorCategoria(categoria.id);
                }
            } else {
                await listarProductos();
            }
        }
    });

    document.getElementById('btnSiguiente').addEventListener('click', async () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria');
            if (categoriaActual) {
                const categorias = await listarCategorias();
                const categoria = categorias.find(cat => slugify(cat.nombre) === categoriaActual);
                if (categoria) {
                    await listarProductosPorCategoria(categoria.id);
                }
            } else {
                await listarProductos();
            }
        }
    });
}

// Función para aplicar lazy loading a las imágenes
function aplicarLazyLoading() {
    const images = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => observer.observe(img));
}

// Función para mostrar el modal de detalles del producto
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

// Función para cerrar el modal
function cerrarModal(modal) {
    modal.style.display = 'none';
    modal.remove();
}

// Función para capitalizar texto
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para formatear números
function formatNumber(number) {
    return number.toLocaleString('es-ES');
}