const mongoose = require('mongoose');

const { Schema } = mongoose;
const Feature = new Schema({
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  icon: {
    type: String,
  },
  link: {
    type: String,
  },
  order: {
    type: Number,
  },
  divider: {
    type: Boolean,
  },
  status: {
    type: String,
  },
  featuresIdParent: {
    type: Schema.Types.ObjectId,
    ref: 'Feature',
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
Feature.index({
  projectId: 1,
  code: 1,
}, {
  unique: true,
});
module.exports = mongoose.model('Feature', Feature);
