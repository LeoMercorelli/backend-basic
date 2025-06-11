// Conecto el cliente con el servidor por websockets
const socket = io();

// obtengo los elementos del DOM
const formAgregar = document.getElementById('formAgregar');
const lista = document.getElementById('listaProductos');

// cuando llegan productos desde el server, armo la lista
socket.on('productos', productos => {
    lista.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `ID: ${p.id} – ${p.title} ($${p.price}) <button data-id="${p.id}">Eliminar</button>`;
        lista.appendChild(li);
    });
});

// si se hace clic en eliminar, aviso al servidor
lista.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const id = parseInt(e.target.getAttribute('data-id'));
        socket.emit('eliminarProducto', id);
    }
});

// cuando se envía el formulario agrego el producto
formAgregar.addEventListener('submit', e => {
    e.preventDefault();
    const title = e.target.title.value;
    const price = parseFloat(e.target.price.value);
    socket.emit('nuevoProducto', { title, price });
    e.target.reset();
});

