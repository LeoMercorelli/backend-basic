// Gestor de carritos usando archivos plano
const fs = require('fs').promises;

class CartManager {
    // guardo la ruta del archivo donde están los carritos
    constructor(path) {
        this.path = path;
    }

    // devuelvo todos los carritos guardados
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // si no existe el archivo devuelvo vacío
            return [];
        }
    }

    // buscar un carrito por id
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(c => c.id === id);
        } catch (error) {
            throw error;
        }
    }

    // crear un carrito nuevo
    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: []
            };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    // agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) return null;

            // si ya estaba en el carrito solo sumo la cantidad
            const productInCart = cart.products.find(p => p.product === productId);
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager;

