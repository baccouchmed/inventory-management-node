const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../../models/administration/user');
const UserGroup = require('../../models/administration/user-group');
const ParamProject = require('../../models/administration/paramProject');
const ProductRequest = require('../../models/sgs/product-request');
const { errorCatch } = require('../../shared/utils');
const { warpedJwtSign } = require('../../shared/warped-jwt-sign');
const { types, CreateStatusEnum } = require('../../shared/enums');
const { getDefaultFeature } = require('../../shared/default-feature');
const ProductStock = require('../../models/sgs/product-stock');
const Company = require('../../models/administration/company');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password +confirmationDate');
    if (!user) {
      return res.status(400).send({
        errors: [
          {
            msg: 'Address email or password is invalid',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        errors: [
          {
            msg: 'Address email or password is invalid',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }

    if (user.type !== types.super) {
      const userGroup = await UserGroup.findOne({
        companyId: user.companyId,
        usersId: user._id,
      });
      if (userGroup && userGroup.groupId) {
        user.groupsId = userGroup.groupId;
      }
      user.defaultLink = await getDefaultFeature(user);
    }
    const badgeStock = await ProductStock.find({
      companyId: mongoose.Types.ObjectId(user.companyId),
      minStock: { $exists: true },
    }).countDocuments();
    const badgeMyRequest = await ProductRequest.find({
      requesterId: mongoose.Types.ObjectId(user.companyId),
      requestedValidation: true,
      $or: [{ requesterValidation: false }, { requesterValidation: { $exists: false } }],
    }).countDocuments();
    const token = await warpedJwtSign(user);
    return res.status(200).json({ token, badgeStock, badgeMyRequest });
  } catch (e) {
    return errorCatch(e, res);
  }
};
// ****************************** refreshToken ****************************** //

const refreshToken = async (req, res) => {
  const {
    companyId, password,
  } = req.body;
  try {
    const { user } = req;
    const paramProject = await ParamProject.findOne({ companyId: user.companyId });
    if (!paramProject) {
      return res.status(404).json({
        message: '404 Params project not found',
      });
    }
    if (!paramProject.suspendPassword) {
      if (!password) {
        return res.status(400).send({
          errors: [
            {
              msg: 'Invalid password',
              param: 'password',
              location: 'body',
            },
          ],
        });
      }
      const userFind = await User.findById(req.user.id).select('+password');
      if (!userFind) {
        return res.status(404).send({
          errors: [
            {
              msg: '404 not found',
              param: 'id',
              location: 'body',
            },
          ],
        });
      }
      const isMatch = await bcryptjs.compare(password, userFind.password);
      if (!isMatch) {
        return res.status(400).send({
          errors: [
            {
              msg: 'Incorrect password.',
              param: 'password',
              location: 'body',
            },
          ],
        });
      }
    }
    if (user.type !== types.super) {
      if (companyId) {
        return res.status(403).json({
          message: '403 Company id forbidden',
        });
      }
    }
    console.log('***************', companyId);
    if (companyId) {
      user.companyId = companyId;
    }
    user._id = user.id;
    const token = await warpedJwtSign(user);
    console.log(token);
    return res.status(200).json(token);
  } catch (e) {
    return errorCatch(e, res);
  }
};

// ****************************** signUp ****************************** //

const signUp = async (req, res) => {
  const {
    company,
  } = req.body;
  try {
    console.log(company);
    const newCompany = new Company({
      name: company.name,
      type: company.type,
      countryId: company.countryId._id,
      governorateId: company.governorateId._id,
      municipalityId: company.municipalityId._id,
      status: CreateStatusEnum.pending,
    });
    if (company.address) {
      newCompany.address = company.address;
    }
    if (company.phone) {
      newCompany.phone = company.phone;
    }
    if (company.email) {
      newCompany.email = company.email.toLowerCase();
    }
    if (company.postalCode) {
      newCompany.postalCode = company.postalCode;
    }
    if (company.identifier) {
      newCompany.identifier = company.identifier;
    }
    if (company.fax) {
      newCompany.fax = company.fax;
    }
    await newCompany.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  login, refreshToken, signUp,
};
