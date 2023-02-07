const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductStock = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  companyProductId: {
    type: Schema.Types.ObjectId,
    ref: 'CompanyProduct',
  },
  typeProductId: {
    type: Schema.Types.ObjectId,
    ref: 'TypeProduct',
  },
  companyProductTypeProductId: {
    type: Schema.Types.ObjectId,
    ref: 'CompanyProductTypeProduct',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantityIn: [{
    quantity: { type: Number },
    date: { type: String },
    unitPrice: { type: Number },
    totalPrice: { type: Number },
  }],
  quantityOut: [{
    quantity: { type: Number },
    date: { type: String },
    unitPrice: { type: Number },
    totalPrice: { type: Number },
  }],
  minStock: {
    type: 'Number',
  },
  price: {
    type: 'Number',
  },
}, { timestamps: true });

module.exports = mongoose.model('ProductStock', ProductStock);
