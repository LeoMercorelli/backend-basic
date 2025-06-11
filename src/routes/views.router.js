// Rutas que devuelven vistas con Handlebars
const path = require('path');
const { Router } = require('express');
const productService = require('../services/products.service');
const cartService = require('../services/carts.service');

const router = Router();

// Redirección al listado de productos
router.get('/', (req, res) => {
    res.redirect('/products');
});

// Vista con paginación de productos
// Envío los datos de productos para que se muestren de entrada.
// Luego el script del frontend puede volver a pedirlos según los filtros.
router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;
    const search = req.query.search;
    const result = await productService.getProductsPaginated({ limit, page, sort, query, search });
    // mando productos y datos de la paginación a la plantilla
    res.render('index', { products: result.docs, pagination: result });
});

// Vista de detalle de un producto
router.get('/products/:pid', async (req, res) => {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
});

// Vista de un carrito
router.get('/carts/:cid', async (req, res) => {
    const cart = await cartService.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
});

// Vista en tiempo real (WebSocket)
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;

