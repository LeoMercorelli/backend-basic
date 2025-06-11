// Funciones que interactúan con la colección de productos
const Product = require('../models/Product');

// traer todos los productos (sin paginar)
async function getProducts() {
  return Product.find().lean();
}

// lista con paginación, orden y filtros
async function getProductsPaginated({ limit = 5, page = 1, sort, query, search }) {
  const filter = {};
  if (query !== undefined) {
    if (query === 'true' || query === 'false') {
      filter.status = query === 'true';
    } else if (query) {
      filter.category = { $regex: query, $options: 'i' };
    }
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

  // calculo el total de documentos que cumplen con el filtro
  const totalDocs = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / limit) || 1;
  const start = (page - 1) * limit;

  // obtengo solo la página solicitada aplicando filtro y orden
  const docs = await Product.find(filter, null, { lean: true })
    .sort(sortOption)
    .skip(start)
    .limit(limit);

  return {
    docs,
    totalDocs,
    limit,
    totalPages,
    page,
    pagingCounter: start + 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null
  };
}

// buscar uno por id
async function getProductById(id) {
  return Product.findById(id).lean();
}

// crear un nuevo documento
async function addProduct(product) {
  return Product.create(product);
}

// actualizar un documento existente
async function updateProduct(id, fields) {
  return Product.findByIdAndUpdate(id, fields, { new: true }).lean();
}

// eliminar por id
async function deleteProduct(id) {
  return Product.findByIdAndDelete(id).lean();
}

module.exports = {
  getProducts,
  getProductsPaginated,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};

