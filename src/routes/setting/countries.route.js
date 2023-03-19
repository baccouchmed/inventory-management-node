const express = require('express');
const { param } = require('express-validator');
const Country = require('../../models/setting/country');
const { isAuth, isAuthorized } = require('../../middlewares/authorization');
const { paginatedCountries } = require('../../middlewares/pagination');
const {
  getCountries,
  deleteCountry,
  addCountry,
  getSingleCountry,
  getGovernorates,
  getMunicipalities,
  updateCountry,
  getAllCountries,
} = require('../../controllers/setting/countries.controller');
const { features, actions } = require('../../shared/enum-features');

const countriesRoute = express.Router();

// Get all countries
countriesRoute.get('/', isAuth, isAuthorized([
  {
    code: features.countries,
    actions: [actions.list],
  },
]), paginatedCountries(Country),
getCountries);
// Delete country
countriesRoute.delete('/:id',
  isAuth, isAuthorized([
    {
      code: features.countries,
      actions: [actions.delete],
    },
  ]),
  deleteCountry);
// Add country //
countriesRoute.post('/', isAuth, isAuthorized([
  {
    code: features.countries,
    actions: [actions.create],
  },
]),
addCountry);
countriesRoute.get('/all',
  getAllCountries);
// get single country
countriesRoute.get('/:id',
  isAuth, isAuthorized([
    {
      code: features.countries,
      actions: [actions.read, actions.update],
    },
  ]),
  getSingleCountry);
// Get governorates
countriesRoute.get('/:id/governorates',
  getGovernorates);
// Get municipalities
countriesRoute.get('/:id/municipalities',
  getMunicipalities);
// update country
countriesRoute.patch('/', isAuth, isAuthorized([
  {
    code: features.countries,
    actions: [actions.update],
  },
]),
updateCountry);
module.exports = countriesRoute;
