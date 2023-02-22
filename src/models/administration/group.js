const mongoose = require('mongoose');

const { Schema } = mongoose;

const Group = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  code: {
    type: String,
  },
  label: {
    type: String,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
}, { timestamps: true });

module.exports = mongoose.model('Group', Group);
