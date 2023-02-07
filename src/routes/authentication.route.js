const express = require('express');
const authenticationRoute = express.Router();


const {
    login, refreshToken,
} = require('../controllers/authentication.controller');
const {isAuth} = require("../middlewares/authorization");

// ****************************** login ****************************** //
authenticationRoute.post('/login',
    login);
// ****************************** refreshToken ****************************** //
authenticationRoute.post('/refresh-token',
  isAuth,
  refreshToken);
module.exports = authenticationRoute;
