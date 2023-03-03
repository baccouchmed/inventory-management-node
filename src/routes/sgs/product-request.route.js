const express = require('express');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');

const productRequestRoute = express.Router();

const {
  addProductRequest, getAllProductRequest, updateQuantity, downloadInvoice, validateUnitPrice, validateQuantity, requestedValidate, requesterValidate, requestedDone,
} = require('../../controllers/sgs/product-request.controller');
const { features, actions } = require('../../shared/enum-features');
const { paginatedProductRequest } = require('../../middlewares/pagination');
const ProductRequest = require('../../models/sgs/product-request');

productRequestRoute.post('/', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), addProductRequest);
productRequestRoute.get('/', isAuth, paginatedProductRequest(ProductRequest), getAllProductRequest);
productRequestRoute.patch('/:productRequest/update-quantity/:id', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), updateQuantity);
productRequestRoute.patch('/:productRequest/validate-quantity/:id', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), validateQuantity);
productRequestRoute.patch('/:productRequest/unit-price-requested/:id', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), validateUnitPrice);
productRequestRoute.patch('/:productRequest/requested-validate', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), requestedValidate);
productRequestRoute.get('/:productRequest/requester-validate', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), requesterValidate);
productRequestRoute.get('/:productRequest/requested-done', isAuth, isAuthorized([
  {
    code: features.contracts,
    actions: [actions.create],
  },
]), requestedDone);
productRequestRoute.get('/download-invoice', isAuth, downloadInvoice);

module.exports = productRequestRoute;
