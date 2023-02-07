const Feature = require('../models/feature');
const UsersFeature = require('../models/user-feature');
const GroupFeature = require('../models/group-feature');
const { featureStatus, types } = require('./enums');
const UserGroup = require('../models/user-group');

const getDefaultFeature = async (user) => {
  if (user.type === types.super) {
    const userFeatureFind = await Feature.findOne({
      link: { $exists: true },
    });
    return userFeatureFind.link;
  }
  let userFeatureFind = await UsersFeature.findOne({
    usersId: user._id,
    defaultFeature: true,
  })
    .populate('featuresId');
  if (!userFeatureFind
      || (userFeatureFind && !userFeatureFind.featuresId)
      || (userFeatureFind && userFeatureFind.featuresId && userFeatureFind.featuresId.status !== featureStatus.active)
    || (userFeatureFind && userFeatureFind.featuresId
      && userFeatureFind.featuresId.status === featureStatus.active && !userFeatureFind.featuresId.link)
  ) {
    const userGroup = await UserGroup.findOne({
      companyId: user.companyId,
      usersId: user._id,
    });
    userFeatureFind = await GroupFeature.findOne({
      groupsId: userGroup.groupId,
      defaultFeature: true,
    })
      .populate('featuresId');
    if (!userFeatureFind) {
      throw new Error('Default feature not found');
    }
    if (userFeatureFind && !userFeatureFind.featuresId) {
      throw new Error('Feature not found');
    }
    if (userFeatureFind && userFeatureFind.featuresId && userFeatureFind.featuresId.status !== featureStatus.active) {
      throw new Error('Feature not active');
    }
    if (userFeatureFind && userFeatureFind.featuresId
        && userFeatureFind.featuresId.status === featureStatus.active && !userFeatureFind.featuresId.link) {
      throw new Error('No available link for default feature');
    }
  }
  return userFeatureFind.featuresId.link;
};

module.exports = { getDefaultFeature };
