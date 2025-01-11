const ApiProductosPorCategoria = 'http://localhost:8084/producto/categoria/';
const selectElements = {
    procesador: document.querySelector('#procesador'),
    ram: document.querySelector('#ram'),
    board: document.querySelector('#board'),
    fuentePoder: document.querySelector('#fuentePoder'),
    grafica: document.querySelector('#grafica'),
    disco: document.querySelector('#disco'),
    monitor: document.querySelector('#monitor')
};
const cantidadRam = document.querySelector('#cantidadRam');
const carrito = [];

function fetchProductosPorCategoria(id) {
    return fetch(`${ApiProductosPorCategoria}${id}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching productos por categoria:', error);
        });
}

function llenarSelect(selectElement, categoriaId) {
    fetchProductosPorCategoria(categoriaId)
        .then(data => {
            // Filtrar productos que no contengan "laptop" en el nombre
            const productosFiltrados = data.filter(producto => !producto.nombre.toLowerCase().includes('laptop'));

            productosFiltrados.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.id;
                option.dataset.precio = producto.precioVendido;
                option.textContent = `${producto.nombre} - $${formatNumber(producto.precioVendido)}`;
                selectElement.appendChild(option);
            });
        });
}
function mostrarOpcionesDisco() {
    const tipoDisco = document.getElementById('tipoDisco').value;
    const discoSeleccionado = document.getElementById('discoSeleccionado');
    if (tipoDisco === 'ssd') {
        limpiarOpcionesDisco();
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona el disco SSD';
        selectElements.disco.appendChild(defaultOption);
        discoSeleccionado.style.display = 'block';
        llenarSelect(selectElements.disco, 1);
    } else if (tipoDisco === 'nvme') {
        limpiarOpcionesDisco();
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona el disco NVME';
        selectElements.disco.appendChild(defaultOption);
        discoSeleccionado.style.display = 'block';
        llenarSelect(selectElements.disco, 2);
    } else {
        limpiarOpcionesDisco();
        discoSeleccionado.style.display = 'none';
    }
}

function limpiarOpcionesDisco() {
    while (selectElements.disco.firstChild) {
        selectElements.disco.removeChild(selectElements.disco.firstChild);
    }
}

function actualizarCarrito(selectId, selectedOption) {
    const carritoTabla = document.querySelector('#carritoTabla');
    const totalElement = document.querySelector('#total');
    let precio = parseFloat(selectedOption.dataset.precio);
    let nombre = selectedOption.textContent.split(' - ')[0];
    const index = carrito.findIndex(item => item.id === selectId);

    if (selectedOption.value) {
        
        if (selectId === 'ram') {
            const cantidad = parseInt(cantidadRam.value, 10) || 1;
            precio *= cantidad;
            nombre = `${nombre} (x${cantidad})`;
        }
        const producto = {
            id: selectId,
            nombre: `${nombre} - $${formatNumber(precio)}`,
            precio
        };

        if (index > -1) {
            carrito[index] = producto;
        } else {
            carrito.push(producto);
        }
    } else if (index > -1) {
        carrito.splice(index, 1);
    }

    carritoTabla.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const tr = document.createElement('tr');

        const nombreProducto = document.createElement('td');
        nombreProducto.textContent = item.nombre.split(' - ')[0];
        console.log(item)
        tr.appendChild(nombreProducto)

        const precioProducto = document.createElement('td');
        precioProducto.textContent ='$' + formatNumber(item.precio);
        tr.appendChild(precioProducto)

        carritoTabla.appendChild(tr)

        total += item.precio

    });
    totalElement.textContent = `Total: $${formatNumber(total)}`;

    validar()
}

function validar() {
    const totalElement = document.querySelector('#total');
    const descuentoElement = document.querySelector('#descuento');
    const tecladoMouseElement = document.querySelector('#tecladoMouse');

    const tieneProcesador = carrito.some(item => item.id === 'procesador');
    const tieneRam = carrito.some(item => item.id === 'ram');
    const tieneBoard = carrito.some(item => item.id === 'board');
    const tieneFuentePoder = carrito.some(item => item.id === 'fuentePoder');
    const tieneDisco = carrito.some(item => item.id === 'disco');
    const tieneGabinete = carrito.some(item => item.id === 'gabinete');
    const tieneMonitor = carrito.some(item => item.id === 'monitor');
    const carritoProducto = document.querySelector('#carrito')

    if (tieneProcesador && tieneRam && tieneBoard && tieneFuentePoder && tieneDisco && tieneGabinete) {
        let total = carrito.reduce((sum, item) => sum + item.precio, 0);
        const descuento = total * 0.05;
        const totalConDescuento = total - descuento;

        totalElement.innerHTML = `Total: <s>$${formatNumber(total)}</s>`;
        totalElement.classList.remove('green');
        totalElement.classList.add('tachado')
        descuentoElement.textContent = `Total con descuento: $${formatNumber(totalConDescuento)}`;

        if (tieneMonitor) {
            tecladoMouseElement.textContent = 'Obsequio: Teclado y Mouse: Gratis 🎁';
        } else {
            tecladoMouseElement.textContent = '';
        }
    } else {
        descuentoElement.textContent = '';
        tecladoMouseElement.textContent = '';
        totalElement.classList.add('green');
        totalElement.classList.remove('tachado')
    }
}

Object.keys(selectElements).forEach(selectId => {
    const selectElement = selectElements[selectId];

    selectElement.addEventListener('change', (event) => {
        actualizarCarrito(selectId, event.target.selectedOptions[0]);
    });
});

cantidadRam.addEventListener('change', () => {
    const selectedOption = selectElements.ram.selectedOptions[0];
    if (selectedOption) {
        actualizarCarrito('ram', selectedOption);
    }
});

const gabineteOption = document.createElement('option');
gabineteOption.value = 'gabinete-basico-rgb';
gabineteOption.dataset.precio = 300000;
gabineteOption.textContent = 'GABINETE 4 FANS RGB - $300,000';
document.querySelector('#gabinete').appendChild(gabineteOption);

document.querySelector('#gabinete').addEventListener('change', (event) => {
    actualizarCarrito('gabinete', event.target.selectedOptions[0]);
});

llenarSelect(selectElements.procesador, 20);
llenarSelect(selectElements.ram, 4);
llenarSelect(selectElements.board, 19);
llenarSelect(selectElements.fuentePoder, 5);
llenarSelect(selectElements.grafica, 8);
llenarSelect(selectElements.monitor, 3);