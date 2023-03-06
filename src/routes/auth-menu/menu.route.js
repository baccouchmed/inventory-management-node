const express = require('express');
const mongoose = require('mongoose');
const { errorCatch } = require('../../shared/utils');
const UsersFeature = require('../../models/administration/user-feature');
const UserGroup = require('../../models/administration/user-group');
const { isAuth } = require('../../middlewares/authorization');
const GroupsFeature = require('../../models/administration/group-feature');
const User = require('../../models/administration/user');
const Feature = require('../../models/setting/feature');
const { types, featureStatus } = require('../../shared/enums');
const { actions } = require('../../shared/enum-features');

const menusRoute = express.Router();
// ****************************** ADD USER ****************************** //

// get menu aut
menusRoute.get('/', isAuth,
  async (req, res) => {
    try {
      let features = [];
      const user = await User.findById(req.user.id);
      if (req.user.type === types.super) {
        const featureList = await Feature.aggregate([
          {
            $match: { status: featureStatus.active },
          },
          {
            $sort: { order: 1 },
          },
        ]);
        features = featureList.map((feature) => ({
          _id: feature._id,
          id: feature._id,
          subtitle: feature.subtitle,
          link: feature.link,
          icon: feature.icon,
          featuresIdParent: feature.featuresIdParent,
          code: feature.code,
          title: feature.title,
          create: true,
          delete: true,
          update: true,
          read: true,
          type: feature.type,
          children: [],
        }));
      } else {
        const filterUser = { usersId: mongoose.Types.ObjectId(req.user.id) };
        const usersFeatures = await UsersFeature.aggregate([
          {
            $match: filterUser,
          },
          {
            $lookup: {
              from: 'features',
              localField: 'featuresId',
              foreignField: '_id',
              as: 'featuresId',
            },
          },
          {
            $unwind: {
              path: '$featuresId',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: { 'featuresId.status': featureStatus.active },
          },
          {
            $sort: { 'featuresId.order': 1 },
          },
        ]);
        let groupsFeatures = [];
        const userGroup = await UserGroup.findOne({
          companyId: user.companyId,
          usersId: user._id,
        });
        if (userGroup && userGroup.groupId) {
          const filterGroup = { groupsId: userGroup.groupId };
          groupsFeatures = await GroupsFeature.aggregate([
            {
              $match: filterGroup,
            },
            {
              $lookup: {
                from: 'features',
                localField: 'featuresId',
                foreignField: '_id',
                as: 'featuresId',
              },
            },
            {
              $unwind: {
                path: '$featuresId',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: { 'featuresId.status': featureStatus.active },
            },
            {
              $sort: { 'featuresId.order': 1 },
            },
          ]);
        }
        // create object feature and crud
        const usersFeaturesData = usersFeatures.map((feature) => ({
          _id: feature.featuresId._id,
          id: feature.featuresId._id,
          subtitle: feature.featuresId.subtitle,
          link: feature.featuresId.link,
          icon: feature.featuresId.icon,
          featuresIdParent: feature.featuresId.featuresIdParent,
          code: feature.featuresId.code,
          title: feature.featuresId.title,
          create: feature.create ? feature.create : false,
          delete: feature.delete ? feature.delete : false,
          update: feature.update ? feature.update : false,
          read: feature.read ? feature.read : false,
          type: feature.featuresId.type,
          status: feature.status,
          children: [],
        }));
        const groupsFeaturesData = groupsFeatures.map((feature) => ({
          _id: feature.featuresId._id,
          id: feature.featuresId._id,
          subtitle: feature.featuresId.subtitle,
          link: feature.featuresId.link,
          icon: feature.featuresId.icon,
          featuresIdParent: feature.featuresId.featuresIdParent,
          code: feature.featuresId.code,
          title: feature.featuresId.title,
          create: feature.create ? feature.create : false,
          delete: feature.delete ? feature.delete : false,
          update: feature.update ? feature.update : false,
          read: feature.read ? feature.read : false,
          type: feature.featuresId.type,
          status: feature.status,
          children: [],
        }));
        // concat user and group features
        features = usersFeaturesData;
        if (!usersFeaturesData || !usersFeaturesData.length) {
          if (groupsFeaturesData && groupsFeaturesData.length) {
            features = groupsFeaturesData;
          }
        } else if (groupsFeaturesData && groupsFeaturesData.length) {
          for await (const groupsFeature of groupsFeaturesData) {
            if (!features.map((feature) => (feature._id.toString()))
              .includes(groupsFeature._id.toString())) {
              features.push(groupsFeature);
            }
          }
        }
        features = features.filter((gfd) => gfd.status);
      }
      const featuresAuth = features.map((f) => {
        const feature = {
          code: f.code,
          actions: [],
        };
        Object.values(actions).forEach((action) => {
          if (f[action] === true) {
            feature.actions.push(action);
          }
        });
        return feature;
      });
      const groups = await features.filter((val) => !val.featuresIdParent);
      const notGroups = await features.filter((val) => val.featuresIdParent);
      const recFunction = async (child) => {
        const featuresA = await notGroups.filter((val) => val.featuresIdParent.toString() === child._id.toString());
        if (featuresA.length) {
          // eslint-disable-next-line no-param-reassign
          child.children = featuresA;
          for await (const feature of featuresA) {
            await recFunction(feature);
          }
        }
      };
      let i = 0;
      const data = [];
      for await (const group of groups) {
        const children = await notGroups.filter((val) => val.featuresIdParent.toString() === group._id.toString());
        data.push(group);
        data[i].children = children;
        for await (const child of data[i].children) {
          await recFunction(child);
        }
        i += 1;
      }
      return res.status(200).json({ menu: data, features: featuresAuth });
    } catch (e) {
      return errorCatch(e, res);
    }
  });

module.exports = menusRoute;
