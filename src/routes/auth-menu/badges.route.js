const express = require('express');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const { features, actions } = require('../../shared/enum-features');
const {
  badgeStocks, badgeMyRequests, badgeStockRequests, badgeStores,
} = require('../../controllers/auth-menu/badges.controller');

const badgesRoute = express.Router();
// ****************************** ADD USER ****************************** //
badgesRoute.get('/stocks', isAuth,
  badgeStocks);
badgesRoute.get('/my-requests', isAuth,
  badgeMyRequests);
badgesRoute.get('/stock-requests', isAuth,
  badgeStockRequests);
badgesRoute.get('/stores', isAuth,
  badgeStores);

module.exports = badgesRoute;
