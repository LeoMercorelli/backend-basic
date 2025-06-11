// Manejador de productos en archivo. Solo lo usé al principio.
const fs = require('fs').promises;

class ProductManager {
    // le paso la ruta donde voy a guardar el JSON
    constructor(path) {
        this.path = path;
    }

    // leer todos los productos desde el archivo
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // si no existe devuelvo un array vacío
            return [];
        }
    }

    // buscar un producto por id
    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(p => p.id === id);
        } catch (error) {
            throw error;
        }
    }

    // agregar un nuevo producto
    async addProduct(product) {
        try {
            const products = await this.getProducts();
            // armo el objeto con un id autoincremental
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product,
            };
            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    // actualizar campos de un producto
    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) return null;

            products[index] = {
                ...products[index],
                ...updatedFields,
                id: products[index].id,
            };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            throw error;
        }
    }

    // borrar un producto
    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== id);
            await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return newProducts;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager;

