// Definición del esquema de productos
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // nombre del producto
  description: { type: String },            // algo de info extra
  code: { type: String },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: { type: String },
  thumbnails: [{ type: String }]
});

// plugin para la paginación
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);

