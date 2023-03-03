const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductRequest = new Schema({
  requesterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  requestedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  dueDate: {
    type: String,
  },
  productsId: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantityRequested: { type: Number },
      quantityValidated: { type: Number },
      unitPriceRequested: { type: Number },
    },
  ],
  requesterValidation: {
    type: Boolean,
  },
  requestedValidation: {
    type: Boolean,
  },
  done: {
    type: Boolean,
  },
}, { timestamps: true });

module.exports = mongoose.model('ProductRequest', ProductRequest);
