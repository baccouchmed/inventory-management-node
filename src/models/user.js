const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false,
  },
  type: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
  },
  thirdPartyTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'ThirdPartyType',
  },
  thirdPartyId: {
    type: Schema.Types.ObjectId,
    ref: 'ThirdParty',
  },
  codePass: {
    type: String,
    select: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', User);
