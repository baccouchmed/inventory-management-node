const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const UserGroup = require('../models/user-group');
const ParamProject = require('../models/paramProject');
const { errorCatch } = require('../shared/utils');
const { warpedJwtSign } = require('../shared/warped-jwt-sign');
const { types } = require('../shared/enums');
const { getDefaultFeature } = require('../shared/default-feature');

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

    const token = await warpedJwtSign(user);
    return res.status(200).json(token);
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
    if (companyId) {
      user.companyId = companyId;
    }
    user._id = user.id;
    const token = await warpedJwtSign(user);
    return res.status(200).json(token);
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  login, refreshToken,
};
