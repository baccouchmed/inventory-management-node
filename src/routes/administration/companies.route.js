const express = require('express');
const {
  param, body,
} = require('express-validator');
const Company = require('../../models/administration/company');
const { uploadLogo } = require('../../shared/warped-multer');
const { features, actions } = require('../../shared/enum-features');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const { paginatedCompanies, paginatedContracts, paginatedValidateContracts } = require('../../middlewares/pagination');
const {
  getAllCompanyPagination,
  getAllContractsPagination,
  getAllValidateContractsPagination,
  getAllCompany,
  addCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  updateLogo,
  getMyCompany,

} = require('../../controllers/administration/companies.controller');

const companiesRoute = express.Router();

companiesRoute.post('/', isAuth, addCompany);
companiesRoute.get('/', isAuth, paginatedCompanies(Company), getAllCompanyPagination);
companiesRoute.get('/contracts', isAuth, paginatedContracts(Company), getAllContractsPagination);
companiesRoute.get('/validate-contracts', isAuth, paginatedValidateContracts(Company), getAllValidateContractsPagination);
companiesRoute.patch('/', isAuth, updateCompany);
companiesRoute.get('/all', isAuth, getAllCompany);
companiesRoute.get('/me', isAuth, getMyCompany);
companiesRoute.get('/:id', isAuth, getCompany);
companiesRoute.delete('/:id', isAuth, deleteCompany);
companiesRoute.post('/:id/logo', isAuth, uploadLogo('public').single('logo'), updateLogo);

module.exports = companiesRoute;
