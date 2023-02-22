const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductStore = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
}, { timestamps: true });

module.exports = mongoose.model('ProductStore', ProductStore);
