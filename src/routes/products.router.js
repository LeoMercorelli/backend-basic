const express = require('express');
const router = express.Router();
// Rutas para los productos
const productsController = require('../controllers/products.controller');

router.get('/', productsController.getProducts);       // listado con querys
router.get('/:pid', productsController.getProductById); // detalle por id
router.post('/', productsController.addProduct);        // alta
router.put('/:pid', productsController.updateProduct);  // modificación
router.delete('/:pid', productsController.deleteProduct); // baja

module.exports = router;

