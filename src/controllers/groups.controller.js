const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');
const UserGroup = require('../models/user-group');
const GroupFeature = require('../models/group-feature');
const { errorCatch } = require('../shared/utils');

const addGroup = async (req, res) => {
  try {
    const {
      group,
      groupFeature,
    } = req.body;

    const existGroup = await Group.findOne({ code: group.code, companyId: req.user.companyId });
    if (existGroup) {
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
    const newGroup = new Group({
      code: group.code,
      label: group.label,
      companyId: req.user.companyId,
      usersCreation: req.user.id,
    });
    await newGroup.save();
    for await (const groupFeatures of groupFeature) {
      if (groupFeatures.featuresId) {
        const newGroupFeature = new GroupFeature({
          companyId: req.user.companyId,
          featuresId: groupFeatures.featuresId._id,
          groupsId: newGroup._id,
          usersCreation: req.user.id,
        });
        if (groupFeatures.list) {
          newGroupFeature.list = true;
        } else {
          newGroupFeature.list = false;
        }
        if (groupFeatures.create) {
          newGroupFeature.create = true;
        } else {
          newGroupFeature.create = false;
        }
        if (groupFeatures.update) {
          newGroupFeature.update = true;
        } else {
          newGroupFeature.update = false;
        }
        if (groupFeatures.delete) {
          newGroupFeature.delete = true;
        } else {
          newGroupFeature.delete = false;
        }
        if (groupFeatures.status) {
          newGroupFeature.status = true;
        } else {
          newGroupFeature.status = false;
        }
        if (groupFeatures.read) {
          newGroupFeature.read = true;
        } else {
          newGroupFeature.read = false;
        }
        if (groupFeatures.defaultFeature) {
          newGroupFeature.defaultFeature = true;
        } else {
          newGroupFeature.defaultFeature = false;
        }
        await newGroupFeature.save();
      }
    }
    return res.status(201).json(newGroup);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const listGroup = async (req, res) => {
  try {
    const group = await Group.find({ companyId: req.user.companyId });
    return res.status(200).json(group);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(200).json(group);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateGroup = async (req, res) => {
  try {
    const {
      group,
      groupFeature,
    } = req.body;
    const { code } = group;
    // check email exist
    const existCode = await Group.findOne({ _id: { $ne: group._id }, code, companyId: req.user.companyId });
    if (existCode) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This code already exists',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const updatedGroup = await Group.findByIdAndUpdate(group._id, {
      code: group.code,
      label: group.label,
    });
    updatedGroup.usersLastUpdate = req.user.id;
    await updatedGroup.save();
    await GroupFeature.deleteMany({ groupsId: updatedGroup._id });
    for await (const groupFeatures of groupFeature) {
      if (groupFeatures.featuresId) {
        const newGroupFeature = new GroupFeature({
          featuresId: groupFeatures.featuresId,
          groupsId: updatedGroup._id,
          usersCreation: req.user.id,
        });
        newGroupFeature.companyId = updatedGroup.companyId;
        if (groupFeatures.list) {
          newGroupFeature.list = true;
        } else {
          newGroupFeature.list = false;
        }
        if (groupFeatures.create) {
          newGroupFeature.create = true;
        } else {
          newGroupFeature.create = false;
        }
        if (groupFeatures.update) {
          newGroupFeature.update = true;
        } else {
          newGroupFeature.update = false;
        }
        if (groupFeatures.delete) {
          newGroupFeature.delete = true;
        } else {
          newGroupFeature.delete = false;
        }
        if (groupFeatures.status) {
          newGroupFeature.status = true;
        } else {
          newGroupFeature.status = false;
        }
        if (groupFeatures.read) {
          newGroupFeature.read = true;
        } else {
          newGroupFeature.read = false;
        }
        if (groupFeatures.defaultFeature) {
          newGroupFeature.defaultFeature = true;
        } else {
          newGroupFeature.defaultFeature = false;
        }
        await newGroupFeature.save();
      }
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const deleteGroup = async (req, res) => {
  try {
    const user = await User.findOne({ groupsId: req.params.id });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const groupFeatureTMS = await getGroupFeature(req.token, req.params.id);
    if (groupFeatureTMS && groupFeatureTMS.length) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    await GroupFeature.deleteMany({ groupsId: req.params.id });
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const groupFeatures = async (req, res) => {
  try {
    const groupFeature = await GroupFeature.find({ groupsId: mongoose.Types.ObjectId(req.params.id) }).populate('featuresId');
    return res.status(200).json(groupFeature);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllGroup = async (req, res) => {
  try {
    const group = await Group.find({ companyId: req.user.companyId });
    return res.status(200).json(group);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await UserGroup.find({ companyId: req.user.companyId, groupId: req.params.id }).populate('usersId');
    return res.status(200).json(users);
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  addGroup,
  listGroup,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  groupFeatures,
  getAllGroup,
};
