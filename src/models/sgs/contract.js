const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema({
  companiesId: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Country',
  }],
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
  status: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Contract', Contract);
