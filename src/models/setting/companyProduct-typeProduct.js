const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompanyProductTypeProduct = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  companyProductId: {
    type: Schema.Types.ObjectId,
    ref: 'CompanyProduct',
    required: true,
  },
  typeProductId: {
    type: Schema.Types.ObjectId,
    ref: 'TypeProduct',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CompanyProductTypeProduct', CompanyProductTypeProduct);
