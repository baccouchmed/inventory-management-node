const mongoose = require('mongoose');
const { errorCatch } = require('../shared/utils');
const City = require('../models/municipality');
const Country = require('../models/country');

const getCountries = (req, res) => {
  res.json(res.paginatedCountries);
};
const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addCountry = async (req, res) => {
  try {
    const {
      country,
      cities,
    } = req.body;
    const newCountry = new Country({
      code: country.code,
      countryName: country.countryName,
      usersCreation: req.user.id,
    });
    await newCountry.save();
    for await (const city of cities) {
      if (
        city.code
        && city.cityName
      ) {
        const newCity = new City({
          code: city.code,
          cityName: city.cityName,
          countryId: newCountry._id,
          usersCreation: req.user.id,
        });
        await newCity.save();
      }
    }
    return res.status(200).json(newCountry);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleCountry = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(200).json(country);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getCities = async (req, res) => {
  try {
    const cities = await City.find({ countryId: mongoose.Types.ObjectId(req.params.id) });
    return res.status(200).json(cities);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateCountry = async (req, res) => {
  try {
    const {
      country,
      cities,
      deletedCities,
    } = req.body;
    const updatedCountry = await Country.findByIdAndUpdate(country._id,
      {
        code: country.code,
        countryName: country.countryName,
        usersLastUpdate: req.user.id,
      });
    await updatedCountry.save();
    for await (const city of cities) {
      if (city._id) {
        await City.findByIdAndUpdate(city._id, {
          code: city.code,
          cityName: city.cityName,
          countryId: country._id,
          userLastUpdate: req.user.id,
        });
      } else if (
        city.code
        && city.cityName
      ) {
        const newCity = new City({
          code: city.code,
          cityName: city.cityName,
          countryId: updatedCountry._id,
          usersCreation: req.user.id,
        });
        await newCity.save();
      }
    }
    for await (const deletedCity of deletedCities) {
      await City.findByIdAndDelete(deletedCity);
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  getCountries,
  deleteCountry,
  addCountry,
  getSingleCountry,
  getCities,
  updateCountry,
};
