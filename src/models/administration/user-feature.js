const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserFeature = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  usersId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  featuresId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Feature',
  },
  status: {
    type: Boolean,
    required: true,
  },
  create: {
    type: Boolean,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
  update: {
    type: Boolean,
    required: true,
  },
  delete: {
    type: Boolean,
    required: true,
  },
  list: {
    type: Boolean,
    default: false,
  },
  defaultFeature: {
    type: Boolean,
    default: false,
    required: false,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
}, { timestamps: true });
module.exports = mongoose.model('UserFeature', UserFeature);
