const express = require('express');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const Category = require('../models/category');

const inventoryRoute = express.Router();

const {
  addCategory, addSubcategory, deductStock, updateStore, addProduct, addStock, updatePrice, updateMinStock, addCompanyProduct, addInventory, getCategories, getCategory, getSubcategories,
} = require('../controllers/inventory.controller');
const { features, actions } = require('../shared/enum-features');
const { paginatedCategories } = require('../middlewares/pagination');

inventoryRoute.post('/categories', isAuth, isAuthorized([
  {
    code: features.inventory,
    actions: [actions.create],
  },
]), addCategory);
inventoryRoute.get('/categories', isAuth, isAuthorized([
  {
    code: features.inventory,
    actions: [actions.list],
  },
]), paginatedCategories(Category), getCategories);
inventoryRoute.post('/subcategory', isAuth, isAuthorized([
  {
    code: features.subcategory,
    actions: [actions.create],
  },
]), addSubcategory);
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
inventoryRoute.post('/inventory', isAuth, isAuthorized([
  {
    code: features.inventory,
    actions: [actions.create],
  },
]), addInventory);
inventoryRoute.get('/categories/:id', isAuth, getCategory);
inventoryRoute.get('/subcategories/:id', isAuth, getSubcategories);
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
