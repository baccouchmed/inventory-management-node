const express = require('express');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const {
  getParamsProject,
  getParamsProjectByCompany,
  updateParamsProject,
} = require('../controllers/params.controller');
const { features, actions } = require('../shared/enum-features');

const paramProjectRoute = express.Router();
// ****************************** ADD USER ****************************** //

// get paramProject
paramProjectRoute.get('/',
  isAuth, isAuthorized([
    {
      code: features.paramProject,
      actions: [actions.read, actions.update],
    },
    {
      code: features.profile,
      actions: [actions.update],
    },
  ]),
  getParamsProject);
// get paramProject by companyId
paramProjectRoute.get('/:companyId',
  getParamsProjectByCompany);
// update paramProject
paramProjectRoute.patch('/', isAuth, isAuthorized([
  {
    code: features.paramProject,
    actions: [actions.update],
  },
]),
updateParamsProject);
module.exports = paramProjectRoute;
