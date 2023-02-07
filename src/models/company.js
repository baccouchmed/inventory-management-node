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
  cityId: {
    type: String,
  },
  countryId: {
    type: String,
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

}, { timestamps: true });

module.exports = mongoose.model('Company', Company);
