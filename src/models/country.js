const mongoose = require('mongoose');

const { Schema } = mongoose;
const Country = new Schema({
  code: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
}, { timestamps: true });
module.exports = mongoose.model('Country', Country);
