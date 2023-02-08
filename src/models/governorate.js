const mongoose = require('mongoose');

const { Schema } = mongoose;
const Governorate = new Schema({
  countryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Country',
  },
  code: {
    type: String,
    required: true,
  },
  governorateName: {
    type: String,
    required: true,
  },
}, { timestamps: true });
module.exports = mongoose.model('Governorate', Governorate);
