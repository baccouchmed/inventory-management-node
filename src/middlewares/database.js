const mongoose = require('mongoose');
require("dotenv").config();

const mongoUri = `mongodb://127.0.0.1:27017/admin`;
console.log(mongoUri)
const setupMongoServer = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.info('Database connected successfully !!');
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = setupMongoServer;
