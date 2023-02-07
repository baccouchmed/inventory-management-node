const mongoose = require('mongoose');

const { Schema } = mongoose;
const ThirdPartyType = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'company',
  },
  code: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  suffix: {
    type: String,
  },
  length: {
    type: Number,
  },
  nature: {
    type: String,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('ThirdPartyType', ThirdPartyType);
