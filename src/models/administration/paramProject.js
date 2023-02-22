const mongoose = require('mongoose');

const { Schema } = mongoose;
const ParamProject = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  codeAttemptNumber: {
    type: Number,
  },
  codeExpirationTime: {
    type: Number,
  },
  suspendPassword: {
    type: Boolean,
  },
  suffixContactCode: {
    type: String,
  },
  lengthContactCode: {
    type: Number,
  },
  confirmationCodeAttempt: {
    type: Number,
  },
  confirmationCodeDuration: {
    type: Number,
  },
  usersCreation: {
    type: Schema.Types.ObjectId,
  },
  usersLastUpdate: {
    type: Schema.Types.ObjectId,
  },
}, { timestamps: true });
module.exports = mongoose.model('ParamProject', ParamProject);
