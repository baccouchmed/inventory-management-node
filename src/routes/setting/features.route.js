const express = require('express');
const Feature = require('../../models/setting/feature');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const { paginatedFeatures } = require('../../middlewares/pagination');
const {
  addFeature,
  getListParents,
  groupFeaturesList,
  getListFeatures,
  deleteFeature,
  getSingleFeature,
  updateFeature,
  getSingleFeatureByLink,
} = require('../../controllers/setting/features.controller');
const { features, actions } = require('../../shared/enum-features');

const featuresRoute = express.Router();

// Add feature //
featuresRoute.post('/', isAuth, isAuthorized([
  {
    code: features.features,
    actions: [actions.create],
  },
]),
addFeature);
// Get list feature
featuresRoute.get('/parents',
  isAuth, isAuthorized([
    {
      code: features.features,
      actions: [actions.create, actions.read, actions.update],
    },
  ]),
  getListParents);
// Get all feature
featuresRoute.get('/group-features',
  isAuth, isAuthorized([
    {
      code: features.groups,
      actions: [actions.create, actions.read, actions.update],
    },
    {
      code: features.userFeatures,
      actions: [actions.create, actions.read, actions.update],
    },
  ]),
  groupFeaturesList);
// Get all features
featuresRoute.get('/', isAuth, isAuthorized([
  {
    code: features.features,
    actions: [actions.list],
  },
]), paginatedFeatures(Feature),
getListFeatures);
// get single feature by code
featuresRoute.post('/link',
  isAuth,
  getSingleFeatureByLink);
// Delete feature
featuresRoute.delete('/:id',
  isAuth, isAuthorized([
    {
      code: features.features,
      actions: [actions.delete],
    },
  ]),
  deleteFeature);
// get single feature
featuresRoute.get('/:id',
  isAuth, isAuthorized([
    {
      code: features.features,
      actions: [actions.read, actions.update],
    },
  ]),
  getSingleFeature);

// update feature
featuresRoute.patch('/', isAuth, isAuthorized([
  {
    code: features.features,
    actions: [actions.update],
  },
]),
updateFeature);
module.exports = featuresRoute;
