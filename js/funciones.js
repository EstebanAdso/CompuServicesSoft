// MENU ADAPTATIVO PARA MOVIL
document.querySelector('.header__menu').addEventListener('click', () => {
    const menu = document.querySelector('.header__lista');
    menu.classList.toggle('active'); // Alternar la clase "active"
});


document.querySelector('.header__logo').addEventListener('click', () => {
    const menu = document.querySelector('.header__lista');
    menu.classList.toggle('active'); // Alternar la clase "active"
});


//Contacto Modal
const modalContacto = document.querySelector('.modalContacto')
const btnContacto = document.querySelector('#contactanos')
const btnCerrar = document.querySelector('#btnCerrar')

btnContacto.addEventListener('click', (e) => {
    e.preventDefault();
    modalContacto.style.display = 'flex';
});

btnCerrar.addEventListener('click', (e) => {
    e.preventDefault()
    modalContacto.style.display = 'none'
})

function formatNumber(number) {
    return number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
