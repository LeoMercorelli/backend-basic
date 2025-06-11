const express = require('express');
const router = express.Router();
// Rutas para manejar carritos
const cartsController = require('../controllers/carts.controller');

router.post('/', cartsController.createCart);                          // nuevo carrito
router.get('/:cid', cartsController.getCartById);                      // ver uno
router.post('/:cid/product/:pid', cartsController.addProductToCart);   // agregar producto
router.delete('/:cid/products/:pid', cartsController.removeProductFromCart); // eliminar producto
router.put('/:cid', cartsController.updateCart);                       // reemplazar carrito
router.put('/:cid/products/:pid', cartsController.updateProductQuantity); // cambiar cantidad
router.delete('/:cid', cartsController.clearCart);                     // vaciar carrito

module.exports = router;

