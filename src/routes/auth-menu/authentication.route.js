const express = require('express');

const authenticationRoute = express.Router();

const {
  login, refreshToken, signUp,
} = require('../../controllers/auth-menu/authentication.controller');
const { isAuth } = require('../../middlewares/authorization');

// ****************************** login ****************************** //
authenticationRoute.post('/login',
  login);
// ****************************** refreshToken ****************************** //
authenticationRoute.post('/refresh-token',
  isAuth,
  refreshToken);
// ****************************** sign up ****************************** //
authenticationRoute.post('/sign-up',
  signUp);
module.exports = authenticationRoute;
