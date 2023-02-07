const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupFeature = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  groupsId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Group',
  },
  featuresId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Feature',
  },
  status: {
    type: Boolean,
    default: false,
  },
  create: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Boolean,
    default: false,
  },
  update: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Boolean,
    default: false,
  },
  defaultFeature: {
    type: Boolean,
    default: false,
    required: true,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
}, { timestamps: true });
module.exports = mongoose.model('GroupFeature', GroupFeature);
