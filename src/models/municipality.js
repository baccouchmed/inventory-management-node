const mongoose = require('mongoose');

const { Schema } = mongoose;
const Municipality = new Schema({
  countryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Country',
  },
  governorateId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Governorate',
  },
  code: {
    type: String,
    required: true,
  },
  municipalityName: {
    type: String,
    required: true,
  },
}, { timestamps: true });
module.exports = mongoose.model('Municipality', Municipality);
