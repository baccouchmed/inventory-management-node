const express = require('express');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');

const inventoryRoute = express.Router();

const {
  deductStock, updateStore, addProduct, addStock, updatePrice, updateMinStock, addCompanyProduct,
} = require('../../controllers/sgs/inventory.controller');
const { features, actions } = require('../../shared/enum-features');

inventoryRoute.post('/company-product', isAuth, isAuthorized([
  {
    code: features.companyProduct,
    actions: [actions.create],
  },
]), addCompanyProduct);
inventoryRoute.post('/products', isAuth, isAuthorized([
  {
    code: features.product,
    actions: [actions.create],
  },
]), addProduct);
inventoryRoute.patch('/stocks/:id/add', isAuth, isAuthorized([
  {
    code: features.stocks,
    actions: [actions.update],
  },
]), addStock);
inventoryRoute.patch('/stocks/:id/deduct', isAuth, isAuthorized([
  {
    code: features.stocks,
    actions: [actions.update],
  },
]), deductStock);
inventoryRoute.patch('/stocks/:id/price', isAuth, isAuthorized([
  {
    code: features.stocks,
    actions: [actions.update],
  },
]), updatePrice);
inventoryRoute.patch('/stocks/:id/min-stock', isAuth, isAuthorized([
  {
    code: features.stocks,
    actions: [actions.update],
  },
]), updateMinStock);
inventoryRoute.patch('/store/:id', isAuth, isAuthorized([
  {
    code: features.store,
    actions: [actions.update],
  },
]), updateStore);
module.exports = inventoryRoute;
