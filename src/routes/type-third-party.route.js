const express = require('express');
const TypeThirdParty = require('../models/third-party-type');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const { paginatedTypeThirdParty } = require('../middlewares/pagination');
const { features, actions } = require('../shared/enum-features');
const {
  addThirdPartyType,
  getListThirdPartyTypes,
  updateThirdPartyType,
  listTypeThirdParty,
  getAllThirdPartyTypes,
  deleteThirdPartyType,
  getThirdPartyTypeNature,
  getAllThirdPartyByNature,
} = require('../controllers/type-third-party.controller');

const typethirdpartyRoute = express.Router();
// Add type third party //
typethirdpartyRoute.post('/', isAuth, isAuthorized([
  {
    code: features.thirdPartyType,
    actions: [actions.create],
  },
]),
addThirdPartyType);
// Get all typethirdparties
typethirdpartyRoute.get('/', isAuth, isAuthorized([
  {
    code: features.thirdPartyType,
    actions: [actions.list],
  },
]), paginatedTypeThirdParty(TypeThirdParty),
getListThirdPartyTypes);
// update type third party
typethirdpartyRoute.patch('/', isAuth, isAuthorized([
  {
    code: features.thirdPartyType,
    actions: [actions.update],
  },
]),
updateThirdPartyType);
typethirdpartyRoute.get('/list-type-third-party',
  isAuth, isAuthorized([
    {
      code: features.users,
      actions: [actions.create, actions.read, actions.update],
    }, {
      code: features.thirdParty,
      actions: [actions.create, actions.read, actions.update],
    }, {
      code: features.paramProject,
      actions: [actions.read, actions.update],
    }, {
      code: features.customer,
      actions: [actions.read],
    }, {
      code: features.supplier,
      actions: [actions.read],
    },
  ]),
  listTypeThirdParty);
// get all third type
typethirdpartyRoute.get('/all',
  isAuth, isAuthorized([
    {
      code: features.users,
      actions: [actions.create, actions.read, actions.update],
    }]),
  getAllThirdPartyTypes);
// Delete
typethirdpartyRoute.delete('/:id',
  isAuth, isAuthorized([
    {
      code: features.thirdPartyType,
      actions: [actions.delete],
    },
  ]),
  deleteThirdPartyType);
// get third type id
typethirdpartyRoute.get('/:nature/typethirdpartyid',
  isAuth, isAuthorized([
    {
      code: features.customer,
      actions: [actions.list],
    }, {
      code: features.supplier,
      actions: [actions.list],
    },
  ]),
  getThirdPartyTypeNature);
//  get All Type Third Party By Nature
typethirdpartyRoute.get('/:nature/allbynature',
  isAuth, isAuthorized([
    {
      code: features.paramProject,
      actions: [actions.update],
    },
  ]),
  getAllThirdPartyByNature);

module.exports = typethirdpartyRoute;
