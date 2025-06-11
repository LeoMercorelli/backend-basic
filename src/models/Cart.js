// Esquema de carritos
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // referencia al producto
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);

