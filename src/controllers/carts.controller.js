// Controlador de carritos, acá delego todo al service
const cartService = require('../services/carts.service');
const Cart = require('../models/Cart');

// crear un carrito vacío
async function createCart(req, res) {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
}

// devolver un carrito con populate
async function getCartById(req, res) {
  try {
    const id = req.params.cid;
    const cart = await Cart.findById(id).populate('products.product').lean();
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
}

// agregar un producto al carrito
async function addProductToCart(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;
    const { cart, created } = await cartService.addProductToCart(cid, pid, quantity);
    res.status(created ? 201 : 200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
}

// eliminar un producto específico del carrito
async function removeProductFromCart(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartService.removeProductFromCart(cid, pid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
}

// reemplazar todo el contenido del carrito
async function updateCart(req, res) {
  try {
    const cid = req.params.cid;
    const cart = await cartService.updateCart(cid, req.body.products || []);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar carrito' });
  }
}

// actualizar solo la cantidad de un producto
async function updateProductQuantity(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const cart = await cartService.updateProductQuantity(cid, pid, quantity);
    if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
}

// dejar el carrito vacío
async function clearCart(req, res) {
  try {
    const cid = req.params.cid;
    const cart = await cartService.clearCart(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart
};

