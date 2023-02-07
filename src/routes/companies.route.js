const express = require('express');
const {
    param, body,
} = require('express-validator');
const Company = require('../models/company');
const { uploadLogo } = require('../shared/warped-multer');
const { features, actions } = require('../shared/enum-features');
const { isAuth, isAuthorized } = require('../middlewares/authorization');
const { paginatedCompanies } = require('../middlewares/pagination');
const {
    getAllCompanyPagination,
    getAllCompany,
    addCompany,
    getCompany,
   // updateCompany,
   // deleteCompany,
   // updateLogo,
   // getMyCompany,

} = require('../controllers/companies.controller');

const companiesRoute = express.Router();

companiesRoute.post('/', isAuth, addCompany);
companiesRoute.get('/', isAuth, paginatedCompanies(Company), getAllCompanyPagination);
// companiesRoute.patch('/', isAuth, updateCompany);
companiesRoute.get('/all', isAuth, getAllCompany);
// companiesRoute.get('/me', isAuth, getMyCompany);
companiesRoute.get('/:id', isAuth, getCompany);
// companiesRoute.delete('/:id', isAuth, deleteCompany);
// companiesRoute.post('/:id/logo', isAuth, uploadLogo('public').single('logo'), updateLogo);

module.exports = companiesRoute;
