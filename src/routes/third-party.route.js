const express = require('express');
const ThirdParty = require('../models/third-party');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const { paginatedThirdParty } = require('../middlewares/pagination');
const { features, actions } = require('../shared/enum-features');
const {
  addThirdParty,
  getThirdPartiesList,
  updateThirdParty,
  listThirdParty,
  getSingleThirdParty,
  deleteThirdParty,
  lastThirdPartySequence,
  getAllThirdParties,
} = require('../controllers/third-party.controller');

const thirdpartyRoute = express.Router();
// Add thirdParty //
thirdpartyRoute.post('/', isAuth, isAuthorized([
  {
    code: features.thirdParty,
    actions: [actions.create],
  }, {
    code: features.customer,
    actions: [actions.create],
  }, {
    code: features.supplier,
    actions: [actions.create],
  },
]),
addThirdParty);
// Get all thirdparties
thirdpartyRoute.get('/', isAuth, isAuthorized([
  {
    code: features.thirdParty,
    actions: [actions.list],
  }, {
    code: features.customer,
    actions: [actions.list],
  }, {
    code: features.supplier,
    actions: [actions.list],
  },
]), paginatedThirdParty(ThirdParty),
getThirdPartiesList);
// update thirdparty
thirdpartyRoute.patch('/', isAuth, isAuthorized([
  {
    code: features.thirdParty,
    actions: [actions.update],
  }, {
    code: features.customer,
    actions: [actions.update],
  }, {
    code: features.supplier,
    actions: [actions.update],
  },
]),
updateThirdParty);
thirdpartyRoute.get('/list-third-party',
  isAuth, isAuthorized([
    {
      code: features.users,
      actions: [actions.create, actions.read, actions.update],
    },
  ]),
  listThirdParty);
// Get single thirdParty
thirdpartyRoute.get('/:id',
  isAuth, isAuthorized([
    {
      code: features.thirdParty,
      actions: [actions.read, actions.update],
    }, {
      code: features.customer,
      actions: [actions.read, actions.update],
    }, {
      code: features.supplier,
      actions: [actions.read, actions.update],
    },
  ]),
  getSingleThirdParty);
// Delete feature
thirdpartyRoute.delete('/:id',
  isAuth, isAuthorized([
    {
      code: features.thirdParty,
      actions: [actions.delete],
    }, {
      code: features.customer,
      actions: [actions.delete],
    }, {
      code: features.supplier,
      actions: [actions.delete],
    },
  ]),
  deleteThirdParty);
// last third party sequence
thirdpartyRoute.get('/:id/code',
  isAuth, isAuthorized([
    {
      code: features.thirdParty,
      actions: [actions.create],
    }, {
      code: features.customer,
      actions: [actions.create],
    }, {
      code: features.supplier,
      actions: [actions.create],
    },
  ]),
  lastThirdPartySequence);

thirdpartyRoute.get('/:id/list-third-party',
  isAuth, isAuthorized([{
    code: features.users,
    actions: [actions.create, actions.read, actions.update],
  }]),
  getAllThirdParties);

module.exports = thirdpartyRoute;
