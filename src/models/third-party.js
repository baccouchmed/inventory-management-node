const mongoose = require('mongoose');

const { Schema } = mongoose;
const ThirdParty = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  thirdPartyTypeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ThirdPartyType',
  },
  code: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  typeIdentifier: {
    type: String,
  },
  identifier: {
    type: String,
  },
  address: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  nature: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
  },
  webSite: {
    type: String,
  },
  managerName: {
    type: String,
  },
  activityDomain: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
});
module.exports = mongoose.model('ThirdParty', ThirdParty);
