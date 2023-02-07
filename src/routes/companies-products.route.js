const express = require('express');
const {
  param, body,
} = require('express-validator');
const CompanyProduct = require('../models/company-product');
const TypeProduct = require('../models/type-product');
const Product = require('../models/product');
const ProductStock = require('../models/product-stock');
const { uploadLogo } = require('../shared/warped-multer');
const { features, actions } = require('../shared/enum-features');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const {
  paginatedCompaniesProducts, paginatedTypeProducts, paginatedProducts, paginatedProductStocks,
} = require('../middlewares/pagination');
const {
  getAllCompanyPagination,
  getAllCompany,
  addCompany,
  getCompany,
  updateCompany,
  // deleteCompany,
  updateLogo,
  // getMyCompany,
  getTypeProducts,
  addTypeProduct,
  updateTypeProduct,
  deleteTypeProduct,
  getAllTypeProducts,
  getCompanyTypeProducts,
  updateProductLogo,
  getAllProductPagination,
  getAllProductStockPagination,
} = require('../controllers/companies-products.controller');

const companiesProductsRoute = express.Router();

companiesProductsRoute.post('/', isAuth, addCompany);
companiesProductsRoute.get('/', isAuth, paginatedCompaniesProducts(CompanyProduct), getAllCompanyPagination);
companiesProductsRoute.get('/products', isAuth, paginatedProducts(Product), getAllProductPagination);
companiesProductsRoute.get('/product-stocks', isAuth, paginatedProductStocks(ProductStock), getAllProductStockPagination);
companiesProductsRoute.patch('/', isAuth, updateCompany);
companiesProductsRoute.get('/all', isAuth, getAllCompany);
companiesProductsRoute.post('/type-product', isAuth, addTypeProduct);
// Get all stages
companiesProductsRoute.get('/type-product', isAuth, paginatedTypeProducts(TypeProduct), (req, res) => {
  res.json(res.paginatedTypeProducts);
});
companiesProductsRoute.get('/type-product/all', isAuth, getAllTypeProducts);
companiesProductsRoute.delete('/type-product/:id', isAuth, deleteTypeProduct);
companiesProductsRoute.patch('/type-product', isAuth, updateTypeProduct);
companiesProductsRoute.post('/products/:id/logo', isAuth, uploadLogo('public').single('logo'), updateProductLogo);

// companiesRoute.get('/me', isAuth, getMyCompany);
companiesProductsRoute.get('/:id', isAuth, getCompany);
companiesProductsRoute.get('/:id/type-product', isAuth, getTypeProducts);
companiesProductsRoute.get('/:id/type-products', isAuth, getCompanyTypeProducts);
// companiesRoute.delete('/:id', isAuth, deleteCompany);
companiesProductsRoute.post('/:id/logo', isAuth, uploadLogo('public').single('logo'), updateLogo);

module.exports = companiesProductsRoute;
