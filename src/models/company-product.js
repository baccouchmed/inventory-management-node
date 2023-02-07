const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompanyProduct = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  name: {
    type: String,
  },
  logo: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('CompanyProduct', CompanyProduct);
