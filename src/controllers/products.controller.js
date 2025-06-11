// Controlador de productos, usa el service para hablar con la DB
const productService = require('../services/products.service');

// lista de productos con paginación y filtros
async function getProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    let query = req.query.query;
    let search = req.query.search;

    // si no se especifica search y query es un string, lo uso para filtrar por nombre
    if (!search && query && query !== 'true' && query !== 'false') {
      search = query;
      query = undefined;
    }

    // pido al service la página que corresponda
    const result = await productService.getProductsPaginated({ limit, page, sort, query, search });

    // armo los links para la paginación
    const baseUrl = req.baseUrl + req.path;
    const searchParam = search ? `&search=${search}` : '';
    const prevLink = result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${sort?`&sort=${sort}`:''}${query?`&query=${query}`:''}${searchParam}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${sort?`&sort=${sort}`:''}${query?`&query=${query}`:''}${searchParam}` : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

// detalle de un producto por id
async function getProductById(req, res) {
  try {
    const id = req.params.pid;
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
}

// crear un nuevo producto
async function addProduct(req, res) {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    // chequeo que no falte nada importante
    if (!title || !description || !code || price == null || status == null || stock == null || !category || !Array.isArray(thumbnails)) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes o inválidos' });
    }
    const newProduct = await productService.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
}

// actualizar un producto existente
async function updateProduct(req, res) {
  try {
    const id = req.params.pid;
    if ('id' in req.body) delete req.body.id; // por las dudas, no dejar cambiar el id
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
}

// eliminar un producto
async function deleteProduct(req, res) {
  try {
    const id = req.params.pid;
    const deleted = await productService.deleteProduct(id);
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

