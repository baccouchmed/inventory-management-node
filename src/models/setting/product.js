const mongoose = require('mongoose');

const { Schema } = mongoose;

const Product = new Schema({
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
  label: {
    type: String,
  },
  logo: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', Product);
