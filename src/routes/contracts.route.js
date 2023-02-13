const express = require('express');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const { features, actions } = require('../shared/enum-features');
const {
  addContract, refreshContract, revokeContract, validateContract,
} = require('../controllers/contracts.controller');

const contractsRoute = express.Router();
// ****************************** ADD USER ****************************** //
// Add contract //
contractsRoute.post('/', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]),
addContract);

// refresh contract //
contractsRoute.post('/refresh', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]),
refreshContract);
// revoke contract //
contractsRoute.post('/revoke', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]),
revokeContract);
// revoke contract //
contractsRoute.post('/validate', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]),
validateContract);
module.exports = contractsRoute;
