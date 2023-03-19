const mongoose = require('mongoose');

const { Schema } = mongoose;

const Product = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
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
  companyProductIdNew: {
    type: String,
  },
  typeProductIdNew: {
    type: String,
  },
  companyProductTypeProductIdNew: {
    type: String,
  },
  label: {
    type: String,
  },
  logo: {
    type: String,
  },
  lot: {
    type: String,
  },
  DF: {
    type: String,
  },
  DLC: {
    type: String,
  },
  status: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', Product);
