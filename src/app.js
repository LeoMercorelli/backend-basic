// src/app.js
// cargo las variables de entorno desde .env
require('dotenv').config(); 

// Acá cargo las dependencias principales que voy a usar
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');

// Importo mis routers para tener todo organizado
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();           // creo la app de Express
const httpServer = createServer(app); // servidor http para enchufar socket.io
const io = new Server(httpServer);    // servidor de websockets

// ----- Conexión a MongoDB -----
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ecommerce';
// me conecto a la base y muestro en consola si fue bien o mal
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar con MongoDB', err));

// ----- Middlewares -----
// para poder leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// archivos estáticos (JS del frontend y estilos)
app.use(express.static(path.join(__dirname, '../public')));

// ----- Handlebars -----
// configuro mi motor de plantillas con algunos helpers
app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b,
    cartTotal: products =>
      products.reduce((acc, p) => {
        const prod = p.product;
        if (prod && typeof prod.price === 'number') {
          return acc + prod.price * p.quantity;
        }
        return acc;
      }, 0)
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// ----- Rutas -----
// endpoints de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// vistas con Handlebars
app.use('/', viewsRouter);

// ----- WebSockets -----
// con socket.io envío cambios en tiempo real
const productService = require('./services/products.service');

io.on('connection', async socket => {
    console.log('🔌 Cliente conectado');

    // ni bien se conecta un cliente le mando la lista completa
    socket.emit('productos', await productService.getProducts());

    // si llega un nuevo producto desde el formulario
    socket.on('nuevoProducto', async prod => {
        await productService.addProduct(prod);
        // aviso a todos que la lista cambió
        io.emit('productos', await productService.getProducts());
    });

    // cuando piden borrar un producto
    socket.on('eliminarProducto', async id => {
        await productService.deleteProduct(id);
        io.emit('productos', await productService.getProducts());
    });
});

// ----- Iniciar servidor -----
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = mongoose.connection;

