const express = require('express');
const {
  param, body,
} = require('express-validator');
const CompanyProduct = require('../../models/setting/company-product');
const TypeProduct = require('../../models/setting/type-product');
const Product = require('../../models/setting/product');
const ProductStock = require('../../models/sgs/product-stock');
const { uploadLogo } = require('../../shared/warped-multer');
const { features, actions } = require('../../shared/enum-features');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const {
  paginatedCompaniesProducts, paginatedTypeProducts, paginatedProducts, paginatedNewProducts, paginatedProductStocks,
} = require('../../middlewares/pagination');
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
  getAllNewProductPagination,
  validateNewProduct,
} = require('../../controllers/setting/companies-products.controller');

const companiesProductsRoute = express.Router();

companiesProductsRoute.post('/', isAuth, addCompany);
companiesProductsRoute.get('/', isAuth, paginatedCompaniesProducts(CompanyProduct), getAllCompanyPagination);
companiesProductsRoute.get('/products', isAuth, paginatedProducts(Product), getAllProductPagination);
companiesProductsRoute.get('/new-products', isAuth, paginatedNewProducts(Product), getAllNewProductPagination);
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
companiesProductsRoute.post('/:id/validate', isAuth, validateNewProduct);
// companiesRoute.delete('/:id', isAuth, deleteCompany);
companiesProductsRoute.post('/:id/logo', isAuth, uploadLogo('public').single('logo'), updateLogo);

module.exports = companiesProductsRoute;
