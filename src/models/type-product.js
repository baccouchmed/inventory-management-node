const mongoose = require('mongoose');

const { Schema } = mongoose;

const TypeProduct = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  label: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('TypeProduct', TypeProduct);
