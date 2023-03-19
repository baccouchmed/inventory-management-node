const mongoose = require('mongoose');

const { Schema } = mongoose;

const Company = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  logo: {
    type: String,
  },
  address: {
    type: String,
  },
  governorateId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Governorate',
  },
  municipalityId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Municipality',
  },
  countryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Country',
  },
  postalCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
  },
  status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', Company);
