const mongoose = require('mongoose');

const { Schema } = mongoose;

const Subcategory = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  label: {
    type: String,
  },
  icon: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', Subcategory);
