const jwt = require('jsonwebtoken');
const Feature = require('../models/feature');
const UsersFeature = require('../models/user-feature');
const GroupFeature = require('../models/group-feature');
const { featureStatus } = require('../shared/enums');
const { types } = require('../shared/enums');
const { features, actions } = require('../shared/enum-features');
const { errorCatch } = require('../shared/utils');

// jwt
const isAuth = (req, res, next) => {
  let { accessToken } = req.query;
  if (accessToken) {
    accessToken = `Bearer ${accessToken}`;
  }
  const authHeader = req.headers.authorization || accessToken;
  if (!authHeader) {
    return res.status(401).json({ message: 'bad token' });
  }
  const tokenSplit = authHeader.split(' ');
  if (tokenSplit.length !== 2) {
    return res.status(401).json({ message: 'bad token' });
  }
  const bearer = tokenSplit[0];
  if (bearer !== 'Bearer') {
    return res.status(401).json({ message: 'bad bearer' });
  }
  const token = tokenSplit[1];
  try {
    return jwt.verify(token, `${process.env.PRIVATE_KEY}`, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: '401 Unauthorized' });
      }
      req.user = user;
      req.token = token;
      return next();
    });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: '401 Unauthorized' });
  }
};
  // role verification
const isAuthorized = (features_) => async (req, res, next) => {
  try {
    if (!features_ || (features_ && features_.length === 0)) {
      return res.status(500).json({ message: 'bad features' });
    }

    for (const feature of features_) {
      const { code } = feature;
      const actionsFeature = feature.actions;
      if (!code || !Object.values(features).includes(code)) {
        return res.status(500).json({ message: `Bad code ${code}` });
      }

      if (!actionsFeature || !actionsFeature.length) {
        return res.status(500).json({ message: 'Bad actions' });
      }

      for (const actionFeature of actionsFeature) {
        if (!Object.values(actions).includes(actionFeature)) {
          return res.status(500).json({ message: `Bad action ${actionFeature} of ${code}` });
        }
      }
    }
    const { type } = req.user;
    if (type === types.super) {
      return next();
    }
    for await (const feature of features_) {
      const { code } = feature;
      const actionsFeature = feature.actions;
      const featureFind = await Feature.findOne({ code });
      if (featureFind && featureFind.status === featureStatus.active) {
        const { companyId } = req.user;
        let userFeatureFind = await UsersFeature.findOne({
          usersId: req.user.id,
          featuresId: featureFind._id,
          companyId,
        });
        if (!userFeatureFind) {
          console.log(req.user);
          const { groupsId } = req.user;
          userFeatureFind = await GroupFeature.findOne({
            groupsId,
            featuresId: featureFind._id,
            companyId,
          });
        }
        if (userFeatureFind && userFeatureFind.status) {
          for (const actionFeature of actionsFeature) {
            if (userFeatureFind[actionFeature]) {
              return next();
            }
          }
        }
      }
    }
    return res.status(403).json({ message: 'Forbidden access', features: features_ });
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  isAuthorized, isAuth,
};
