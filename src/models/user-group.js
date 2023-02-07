const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserGroups = new Schema({
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
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });
module.exports = mongoose.model('UserGroups', UserGroups);
