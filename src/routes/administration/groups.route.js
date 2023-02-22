const express = require('express');
const { param } = require('express-validator');
const Group = require('../../models/administration/group');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const { paginatedGroups } = require('../../middlewares/pagination');
const { features, actions } = require('../../shared/enum-features');
const {
  addGroup,
  listGroup,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  groupFeatures,
  getAllGroup,
} = require('../../controllers/administration/groups.controller');

const groupsRoute = express.Router();
// ****************************** ADD USER ****************************** //
// Add group //
groupsRoute.post('/', isAuth, isAuthorized([
  {
    code: features.groups,
    actions: [actions.create],
  },
]),
addGroup);
// Get all groups
groupsRoute.get('/', isAuth, isAuthorized([
  {
    code: features.groups,
    actions: [actions.list],
  },
]), paginatedGroups(Group),
(req, res) => {
  res.json(res.paginatedGroups);
});
groupsRoute.get('/list-groups', isAuth, isAuthorized([
  {
    code: features.users,
    actions: [actions.create, actions.update, actions.read],
  },
]),
listGroup);
// get singel group
groupsRoute.get('/:id', isAuth,
  isAuthorized([
    {
      code: features.groups,
      actions: [actions.read, actions.update],
    },
  ]),
  getSingleGroup);
// update group
groupsRoute.patch('/:id', isAuth,
  isAuthorized([
    {
      code: features.groups,
      actions: [actions.update],
    },
  ]),
  updateGroup);
// Delete group
groupsRoute.delete('/:id', isAuth, isAuthorized([
  {
    code: features.groups,
    actions: [actions.delete],
  },
]),
deleteGroup);
// features for current group
groupsRoute.get('/:id/group-feature', isAuth,
  isAuthorized([
    {
      code: features.groups,
      actions: [actions.read, actions.update],
    },
  ]),
  groupFeatures);

// list groups for current project
groupsRoute.get('/:id/list-groups', isAuth, isAuthorized([
  {
    code: features.groups,
    actions: [actions.list],
  },
]),
getAllGroup);

module.exports = groupsRoute;
