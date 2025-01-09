const ApiProductosPorCategoria = 'http://localhost:8084/producto/categoria/';
const selectElements = {
    procesador: document.querySelector('#procesador'),
    ram: document.querySelector('#ram'),
    board: document.querySelector('#board'),
    fuentePoder: document.querySelector('#fuentePoder'),
    grafica: document.querySelector('#grafica'),
    disco: document.querySelector('#disco')
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
            data.forEach(producto => {
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
    const carritoList = document.querySelector('#carrito');
    const totalElement = document.querySelector('#total');

    const index = carrito.findIndex(item => item.id === selectId);

    if (selectedOption.value) {
        let precio = parseFloat(selectedOption.dataset.precio);
        let nombre = selectedOption.textContent.split(' - ')[0];
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

    carritoList.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nombre;
        carritoList.appendChild(li);
        total += item.precio;
    });

    totalElement.textContent = `Total: $${formatNumber(total)}`;
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

llenarSelect(selectElements.procesador, 20);
llenarSelect(selectElements.ram, 4);
llenarSelect(selectElements.board, 19);
llenarSelect(selectElements.fuentePoder, 5);
llenarSelect(selectElements.grafica, 8);