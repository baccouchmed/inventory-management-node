const express = require('express');
const { isAuth, isAuthorized } = require('../middlewares/authorization');

const productRequestRoute = express.Router();

const {
  addProductRequest, getAllProductRequest, updateQuantity, validateQuantity, requestedValidate, requesterValidate,
} = require('../controllers/product-request.controller');
const { features, actions } = require('../shared/enum-features');
const { paginatedProductRequest } = require('../middlewares/pagination');
const ProductRequest = require('../models/product-request');

productRequestRoute.post('/', isAuth, isAuthorized([
  {
    code: features.productRequest,
    actions: [actions.create],
  },
]), addProductRequest);
productRequestRoute.get('/', isAuth, paginatedProductRequest(ProductRequest), getAllProductRequest);
productRequestRoute.patch('/:productRequest/update-quantity/:id', isAuth, isAuthorized([
  {
    code: features.productRequest,
    actions: [actions.update],
  },
]), updateQuantity);
productRequestRoute.patch('/:productRequest/validate-quantity/:id', isAuth, isAuthorized([
  {
    code: features.productRequest,
    actions: [actions.update],
  },
]), validateQuantity);
productRequestRoute.patch('/:productRequest/requested-validate', isAuth, isAuthorized([
  {
    code: features.productRequest,
    actions: [actions.update],
  },
]), requestedValidate);
productRequestRoute.get('/:productRequest/requester-validate', isAuth, isAuthorized([
  {
    code: features.productRequest,
    actions: [actions.update],
  },
]), requesterValidate);
module.exports = productRequestRoute;
