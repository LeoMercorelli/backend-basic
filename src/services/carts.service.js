// Funciones para manejar la colección de carritos
const Cart = require('../models/Cart');

// crear un carrito vacío en la base
async function createCart() {
  return Cart.create({ products: [] });
}

// buscar un carrito y traer la info de los productos
async function getCartById(id) {
  return Cart.findById(id).populate('products.product').lean();
}

// sumar un producto o agregarlo si no estaba
async function addProductToCart(cid, pid, quantity = 1) {
  let cart = await Cart.findById(cid);
  let created = false;

  if (!cart) {
    cart = new Cart({ products: [{ product: pid, quantity }] });
    created = true;
  } else {
    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
  }

  await cart.save();
  await cart.populate('products.product');
  return { cart: cart.toObject ? cart.toObject() : cart, created };
}

// quitar un producto del carrito
async function removeProductFromCart(cid, pid) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  return cart.populate('products.product');
}

// reemplazar todos los productos del carrito
async function updateCart(cid, products) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  cart.products = products;
  await cart.save();
  return cart.populate('products.product');
}

// modificar solo la cantidad de un producto
async function updateProductQuantity(cid, pid, quantity) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) return null;
  item.quantity = quantity;
  await cart.save();
  return cart.populate('products.product');
}

// dejar un carrito sin productos
async function clearCart(cid) {
  const cart = await Cart.findById(cid);
  if (!cart) return null;
  cart.products = [];
  await cart.save();
  return cart;
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

