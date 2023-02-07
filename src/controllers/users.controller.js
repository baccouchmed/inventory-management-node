const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const UserGroup = require('../models/user-group');
require('../models/company');
const { errorCatch } = require('../shared/utils');

const { types } = require('../shared/enums');

const getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user.id).populate({ path: 'companyId', model: 'Company' });
    if (!me) {
      return res.status(404).json({
        message: '404 no user found',
      });
    }
    return res.status(200).json(me);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const checkPassword = async (req, res) => {
  try {
    const {
      password,
    } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
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
    const isMatch = await bcryptjs.compare(password, user.password);
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
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ companyId: req.params.id });
    return res.status(200).json(users);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: '404 user not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('defaultSite thirdPartyTypeId thirdPartyId').select('+confirmationDate');
    if (!user) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    let dataUser = { ...user._doc };
    if (user.type !== types.super) {
      const userGroup = await UserGroup.findOne({
        companyId: user.companyId,
        usersId: user._id,
      }).populate('groupId');
      dataUser = { ...dataUser, groupsId: userGroup && userGroup.groupId ? userGroup.groupId : null };
    }

    return res.status(200).json(dataUser);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const paginatedUser = (req, res) => {
  res.json(res.paginatedUsers);
};
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(mongoose.Types.ObjectId(req.user.id));

    if (!user) {
      return res.status(404).send({
        errors: [
          {
            msg: 'User IDs do not match',
            param: 'id',
            location: 'token',
          },
        ],
      });
    }
    const {
      name,
      email,
      phone,
    } = req.body;
    const userEmail = await User.findOne({ _id: { $ne: req.user.id }, email: user.email.toLowerCase() });
    if (userEmail) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Address mail already exist',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone;
    await user.save();
    return res.status(200).json(user);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addUser = async (req, res) => {
  try {
    const {
      user,
    } = req.body;
    const existUser = await User.findOne({
      email: user.email.toLowerCase(),
    });
    if (existUser) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This record already exists',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const existCode = await User.findOne({
      companyId: req.user.companyId,
      code: user.code,
    });
    if (existCode) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This code already exists',
            param: 'code',
            location: 'body',
          },
        ],
      });
    }
    const newUser = new User({
      email: user.email.toLowerCase(),
      code: user.code,
      name: user.name,
      type: user.type,
      companyId: req.user.companyId,
      usersCreation: req.user.id,
    });
    if (user.phone) {
      newUser.phone = user.phone;
    }
    if (user.defaultLocal) {
      newUser.defaultLocal = user.defaultLocal._id;
    }
    if (user.thirdPartyTypeId) {
      newUser.thirdPartyTypeId = user.thirdPartyTypeId._id;
    }
    if (user.thirdPartyId) {
      newUser.thirdPartyId = user.thirdPartyId._id;
    }
    if (user.defaultSite) {
      newUser.defaultSite = user.defaultSite._id;
    }
    const salt = await bcryptjs.genSalt(10);
    if (user.password) {
      newUser.password = await bcryptjs.hash(user.password, salt);
    }
    await newUser.save();
    if (user.groupsId) {
      const newUserGroup = new UserGroup({
        usersId: newUser._id,
        groupId: user.groupsId._id,
        companyId: req.user.companyId,
        usersCreation: req.user.id,
      });
      await newUserGroup.save();
    }

    return res.status(201).json(newUser);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).send({
        errors: [
          {
            msg: 'User Id do not match',
            param: 'id',
            location: 'token',
          },
        ],
      });
    }

    user.avatar = req.file.filename;

    await user.save();

    return res.status(200).json(user);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateMyAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).send({
        errors: [
          {
            msg: 'User Id do not match',
            param: 'id',
            location: 'token',
          },
        ],
      });
    }

    user.avatar = req.file.filename;

    await user.save();

    return res.status(200).json(user);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateUserBeta = async (req, res) => {
  try {
    const {
      user,
    } = req.body;
    // check email exist
    const existEmail = await User.findOne({
      companyId: user.companyId,
      email: user.email.toLowerCase(),
      _id: { $ne: req.params.id },
    });
    if (existEmail) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This email already exists',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const existCode = await User.findOne({
      _id: { $ne: user._id },
      code: user.code,
      companyId: user.companyId,
    });
    if (existCode) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This code already exists',
            param: 'code',
            location: 'body',
          },
        ],
      });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      code: user.code,
      email: user.email.toLowerCase(),
      name: user.name,
      type: user.type,
      defaultLocal: user.defaultLocal ? user.defaultLocal : null,
      defaultSite: user.defaultSite ? user.defaultSite._id : null,
    });
    if (user.phone) {
      updatedUser.phone = user.phone;
    } else {
      updatedUser.phone = null;
    }
    if (user.password) {
      const salt = await bcryptjs.genSalt(10);
      updatedUser.password = await bcryptjs.hash(user.password, salt);
    }
    if (user.type !== types.super) {
      if (user.groupsId) {
        const userGroup = await UserGroup.findOne({
          companyId: user.companyId,
          usersId: user._id,
        });
        if (userGroup) {
          userGroup.groupId = user.groupsId._id;
          await userGroup.save();
        } else {
          const newUserGroup = new UserGroup({
            usersId: user._id,
            groupId: user.groupsId._id,
            companyId: req.user.companyId,
            usersCreation: req.user.id,
          });
          await newUserGroup.save();
        }
      } else {
        await UserGroup.deleteOne({
          companyId: user.companyId,
          usersId: user._id,
        });
      }
    }
    if (user.type === 'external') {
      updatedUser.thirdPartyTypeId = user.thirdPartyTypeId ? user.thirdPartyTypeId._id : null;
      updatedUser.thirdPartyId = user.thirdPartyId ? user.thirdPartyId._id : null;
    } else {
      updatedUser.thirdPartyTypeId = null;
      updatedUser.thirdPartyId = null;
    }

    await updatedUser.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  getMe,
  checkPassword,
  getAllUsers,
  deleteUser,
  getSingleUser,
  paginatedUser,
  updateUser,
  addUser,
  updateAvatar,
  updateMyAvatar,
  updateUserBeta,
};
