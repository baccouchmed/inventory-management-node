const mongoose = require('mongoose');

const { Schema } = mongoose;

const Category = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  label: {
    type: String,
  },
  icon: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', Category);
