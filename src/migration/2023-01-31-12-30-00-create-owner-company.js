const bcryptjs = require('bcryptjs');
const Company = require('../models/company');
const User = require('../models/user');
const { types } = require('../shared/enums');

const script = async () => {
  try {

    const company = await Company.create({
      code: '001',
      name: 'BACCOUCH COMPANY',
      email: 'tech@tic-nova.com',
    });
    const salt = await bcryptjs.genSalt(10);
    await User.create({
      companyId: company._id,
      code: '001',
      name: 'super admin',
      email: 'baccouchmed1987@gmail.com',
      password: await bcryptjs.hash('Test123', salt),
      type: types.super,
    });
  } catch (e) {
    console.info(`Error! could not be added - ${e.message}`);
  }
};
module.exports = script;
