const express = require('express');
const User = require('../models/user');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const { features, actions } = require('../shared/enum-features');
const { upload } = require('../shared/warped-multer');
const { paginatedUsers } = require('../middlewares/pagination');

const {
  getMe, checkPassword, addUser, updateMyAvatar, getSingleUser, paginatedUser, updateUser, updateAvatar, updateUserBeta,
} = require('../controllers/users.controller');

const usersRoute = express.Router();

// ****************************** getMe ****************************** //
usersRoute.get('/me',
  isAuth,
  getMe);
// ****************************** checkPassword ****************************** //
usersRoute.post('/check-password',
  isAuth,
  checkPassword);

// ****************************** addUser ****************************** //
usersRoute.post('/',
  isAuth,
  isAuthorized([
    {
      code: features.users,
      actions: [actions.create],
    },
  ]),
  addUser);
// ****************************** updateMyAvatar ****************************** //
usersRoute.post('/my-avatar',
  isAuth,
  upload('public').single('avatar'),
  updateMyAvatar);
// ****************************** getSingleUser ****************************** //
usersRoute.get('/:id',
  isAuth,
  isAuthorized([
    {
      code: features.users,
      actions: [actions.read, actions.update],
    }, {
      code: features.userFeatures,
      actions: [actions.create, actions.read, actions.update],
    }, {
      code: features.profile,
      actions: [actions.list, actions.create, actions.read, actions.update],
    },
  ]),
  getSingleUser);
// ****************************** updateUserBeta ****************************** //
usersRoute.patch('/:id',
  isAuth,
  isAuthorized([
    {
      code: features.users,
      actions: [actions.update],
    },
  ]),
  updateUserBeta);
// ****************************** paginatedUser ****************************** //
usersRoute.get('/',
  isAuth,
  isAuthorized([
    {
      code: features.users,
      actions: [actions.list],
    },
  ]),
  paginatedUsers(User),
  paginatedUser);
// ****************************** updateUser ****************************** //
usersRoute.post('/personal-info',
  isAuth,
  isAuthorized([
    {
      code: features.profile,
      actions: [actions.update],
    },
  ]),
  updateUser);
// ****************************** updateAvatar ****************************** //
usersRoute.post('/:id/avatar',
  isAuth,
  isAuthorized([
    {
      code: features.users,
      actions: [actions.create, actions.update],
    },
  ]),
  upload('public').single('avatar'),
  updateAvatar);
module.exports = usersRoute;
