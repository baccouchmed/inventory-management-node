const mongoose = require('mongoose');
const _ = require('lodash');
const UserFeature = require('../models/administration/user-feature');
const ProductStock = require('../models/sgs/product-stock');
const ProductStore = require('../models/sgs/product-store');
const Company = require('../models/administration/company');
const Contrat = require('../models/sgs/contract');
const { typesCompany, StatusContract, CreateStatusEnum } = require('../shared/enums');

const paginatedUsers = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    const filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'sites',
          localField: 'defaultSite',
          foreignField: '_id',
          as: 'defaultSite',
        },
      },
      { $unwind: { path: '$defaultSite', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          password: 0,
          codePass: 0,
          confirmationPass: 0,
        },
      },
      {
        $match: {
          $or: [
            { code: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { code: { $regex: search, $options: 'i' } },
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedUsers = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedCompanies = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const country = req.query.country || null;
    const governorate = req.query.governorate || null;
    const municipality = req.query.municipality || null;
    const status = req.query.status || null;
    let sortCode = {};
    let sortName = {};
    const filter = {};
    if (country) {
      filter.countryId = mongoose.Types.ObjectId(country);
    }
    if (governorate) {
      filter.governorateId = mongoose.Types.ObjectId(governorate);
    }
    if (municipality) {
      filter.municipalityId = mongoose.Types.ObjectId(municipality);
    }
    if (status) {
      filter.status = status;
    }
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'municipalities',
          localField: 'municipalityId',
          foreignField: '_id',
          as: 'municipalityId',
        },
      },
      { $unwind: { path: '$municipalityId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'governorates',
          localField: 'governorateId',
          foreignField: '_id',
          as: 'governorateId',
        },
      },
      { $unwind: { path: '$governorateId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryId',
        },
      },
      { $unwind: { path: '$countryId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedCompanies = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedCompaniesProducts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    const filter = {};
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedCompaniesProducts = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedFeatures = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    let sortType = {};
    const filter = {};
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { title: 1 };
        break;
      case 'down':
        sortName = { title: -1 };
        break;
      default:
        sortName = { title: -1 };
    }
    switch (req.query.sortType) {
      case 'up':
        sortType = { type: 1 };
        break;
      case 'down':
        sortType = { type: -1 };
        break;
      default:
        sortType = { type: -1 };
    }

    let sort = { ...sortCode, ...sortName, ...sortType };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    if (req.query.sortType === 'up' || req.query.sortType === 'down') {
      sort = { ...sortType };
    }

    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { link: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
              { link: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { type: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedFeatures = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedGroups = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    const filter = {
      companyId: mongoose.Types.ObjectId(req.user.companyId),
    };
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { label: 1 };
        break;
      case 'down':
        sortName = { label: -1 };
        break;
      default:
        sortName = { label: -1 };
    }
    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }

    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedGroups = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedThirdParty = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    let sortType = {};
    let filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
    if (req.query.statusSort.length > 1) {
      req.query.statusSort = req.query.statusSort.split(',').map((statu) => statu);
      req.query.statusSort = req.query.statusSort.map((element) => mongoose.Types.ObjectId(element));
    }
    if (req.query.statusSort !== '') {
      filter = { companyId: mongoose.Types.ObjectId(req.user.companyId), thirdPartyTypeId: { $in: req.query.statusSort } };
    }
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { label: 1 };
        break;
      case 'down':
        sortName = { label: -1 };
        break;
      default:
        sortName = { label: -1 };
    }
    switch (req.query.sortType) {
      case 'up':
        sortType = { 'thirdPartyTypeId.label': 1 };
        break;
      case 'down':
        sortType = { 'thirdPartyTypeId.label': -1 };
        break;
      default:
        sortType = { 'thirdPartyTypeId.label': -1 };
    }

    let sort = { ...sortCode, ...sortName, ...sortType };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    if (req.query.sortType === 'up' || req.query.sortType === 'down') {
      sort = { ...sortType };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'thirdpartytypes',
          localField: 'thirdPartyTypeId',
          foreignField: '_id',
          as: 'thirdPartyTypeId',
        },
      },
      { $unwind: { path: '$thirdPartyTypeId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      { $unwind: { path: '$cityId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryId',
        },
      },
      { $unwind: { path: '$countryId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { 'thirdPartyTypeId.label': { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
              { 'thirdPartyTypeId.label': { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedThirdParty = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedTypeThirdParty = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    const filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { label: 1 };
        break;
      case 'down':
        sortName = { label: -1 };
        break;
      default:
        sortName = { label: -1 };
    }

    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { nature: { $regex: search, $options: 'i' } },
            { suffix: { $regex: search, $options: 'i' } },
            { length: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
              { nature: { $regex: search, $options: 'i' } },
              { suffix: { $regex: search, $options: 'i' } },
              { length: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedTypeThirdParty = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedUsersWithFeature = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    let sortEmail = {};
    let filter;
    if (req.query.userFeatureId !== ' ') {
      if (req.query.userFeatureId.length > 0) {
        req.query.userFeatureId = req.query.userFeatureId.split(',');
        req.query.userFeatureId = req.query.userFeatureId.map((element) => mongoose.Types.ObjectId(element));
        filter = { companyId: mongoose.Types.ObjectId(req.user.companyId), _id: { $in: req.query.userFeatureId } };
      } else {
        filter = { companyId: mongoose.Types.ObjectId(req.user.companyId), _id: { $in: [] } };
      }
    }

    if (req.query.userFeatureId === ' ') {
      const usersWithFeature = await UserFeature.distinct('usersId').populate('usersId');
      filter = { companyId: mongoose.Types.ObjectId(req.user.companyId), _id: { $in: usersWithFeature } };
    }
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    switch (req.query.sortEmail) {
      case 'up':
        sortEmail = { email: 1 };
        break;
      case 'down':
        sortEmail = { email: -1 };
        break;
      default:
        sortEmail = { email: -1 };
    }
    let sort = { ...sortCode, ...sortName, ...sortEmail };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    if (req.query.sortEmail === 'up' || req.query.sortEmail === 'down') {
      sort = { ...sortEmail };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $match: {
          $or: [
            { code: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { code: { $regex: search, $options: 'i' } },
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedUsersWithFeature = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedCountries = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    let sortCode = {};
    let sortName = {};
    const filter = {};
    switch (req.query.sortCode) {
      case 'up':
        sortCode = { code: 1 };
        break;
      case 'down':
        sortCode = { code: -1 };
        break;
      default:
        sortCode = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { countryName: 1 };
        break;
      case 'down':
        sortName = { countryName: -1 };
        break;
      default:
        sortName = { countryName: -1 };
    }
    let sort = { ...sortCode, ...sortName };
    if (req.query.sortCode === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortCode };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }

    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { countryName: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { countryName: { $regex: search, $options: 'i' } },
              { code: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedCountries = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedTypeProducts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const filter = { };
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedTypeProducts = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedCategories = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedCategories = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedProducts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const id = req.query.id || null;
    const type = req.query.type || null;
    const company = req.query.company || null;
    const filter = {};
    if (type) {
      filter.typeProductId = mongoose.Types.ObjectId(type);
    }
    if (company) {
      filter.companyProductId = mongoose.Types.ObjectId(company);
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'typeproducts',
          localField: 'typeProductId',
          foreignField: '_id',
          as: 'typeProductId',
        },
      },
      { $unwind: { path: '$typeProductId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companyproducts',
          localField: 'companyProductId',
          foreignField: '_id',
          as: 'companyProductId',
        },
      },
      { $unwind: { path: '$companyProductId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $skip: id ? 0 : startIndex,
      },
      {
        $limit: id ? Infinity : limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    let finalData = data;
    if (data.length) {
      for await (const [index, product] of data.entries()) {
        const productStock = await ProductStock.findOne({ companyId: req.user.companyId, productId: product._id });
        const productStore = await ProductStore.findOne({ companyId: (id || req.user.companyId), productId: product._id });
        finalData[index] = {
          ...product,
          quantityInTotal: productStock && productStock.quantityIn.length ? productStock.quantityIn.reduce((a, b) => (a + b.quantity), 0) : 0,
          quantityOutTotal: productStock && productStock.quantityOut.length ? productStock.quantityOut.reduce((a, b) => (a + b.quantity), 0) : 0,
          status: productStore !== null,
          minStock: productStock && productStock.minStock ? productStock.minStock : null,
        };
      }
      finalData = finalData.map((val) => ({
        ...val,
        myStock: Number(val.quantityInTotal) - Number(val.quantityOutTotal),
      }));
      if (id) {
        finalData = finalData.filter((val) => (val.status));
        total[0].total = finalData.length;
        finalData = finalData.splice(limit * (page - 1), limit);
      }
    }
    res.paginatedProducts = { data: finalData, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedProductStocks = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const type = req.query.type || null;
    const company = req.query.company || null;
    const inStock = req.query.inStock || null;
    const minStock = req.query.minStock || null;
    let filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
    if (type) {
      filter.typeProductId = mongoose.Types.ObjectId(type);
    }
    if (company) {
      filter.companyProductId = mongoose.Types.ObjectId(company);
    }
    if (inStock) {
      filter.inStock = { $gte: Number(inStock) };
    }
    if (minStock) {
      filter = { ...filter, $expr: { $lte: ['$inStock', '$minStock' || 0] } };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'typeproducts',
          localField: 'typeProductId',
          foreignField: '_id',
          as: 'typeProductId',
        },
      },
      { $unwind: { path: '$typeProductId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companyproducts',
          localField: 'companyProductId',
          foreignField: '_id',
          as: 'companyProductId',
        },
      },
      { $unwind: { path: '$companyProductId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productId',
        },
      },
      { $unwind: { path: '$productId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { 'productId.label': { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'typeproducts',
            localField: 'typeProductId',
            foreignField: '_id',
            as: 'typeProductId',
          },
        },
        { $unwind: { path: '$typeProductId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'companyproducts',
            localField: 'companyProductId',
            foreignField: '_id',
            as: 'companyProductId',
          },
        },
        { $unwind: { path: '$companyProductId', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productId',
          },
        },
        { $unwind: { path: '$productId', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { 'productId.label': { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    let finalData = data;
    if (data.length) {
      finalData = data.map((val) => ({
        ...val,
        quantityInTotal: val.quantityIn.reduce((a, b) => (a + b.quantity), 0),
        totalInPrice: val.quantityIn.reduce((a, b) => (a + (Number(b.quantity) * Number(b.unitPrice))), 0),
        quantityOutTotal: val.quantityOut.reduce((a, b) => (a + b.quantity), 0),
        totalOutPrice: val.quantityOut.reduce((a, b) => (a + (Number(b.quantity) * Number(b.unitPrice))), 0),
      })).map((val) => ({
        ...val,
        quantityTotal: Number(val.quantityInTotal) - Number(val.quantityOutTotal),
      }));
    }
    res.paginatedProductStocks = { data: finalData, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedContracts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const country = req.query.country || null;
    const governorate = req.query.governorate || null;
    const municipality = req.query.municipality || null;
    const typeCompany = req.query.typeCompany || null;
    const statusContract = req.query.statusContract || null;

    let sortType = {};
    let sortName = {};
    const filter = {};
    if (country) { filter.countryId = mongoose.Types.ObjectId(country); }
    if (governorate) { filter.governorateId = mongoose.Types.ObjectId(governorate); }
    if (municipality) { filter.municipalityId = mongoose.Types.ObjectId(municipality); }
    switch (req.query.sortType) {
      case 'up':
        sortType = { code: 1 };
        break;
      case 'down':
        sortType = { code: -1 };
        break;
      default:
        sortType = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    let sort = { ...sortType, ...sortName };
    if (req.query.sortType === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortType };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const myCompany = await Company.findById(req.user.companyId);

    if (typeCompany) { filter.type = typeCompany; } else {
      filter.type = { $in: [typesCompany.factory, typesCompany.supplier, typesCompany.store] };
    }

    const contractsValidateRequester = await Contrat.find({ requesterId: myCompany._id, status: StatusContract.validate });
    const contractsValidateRequested = await Contrat.find({ requestedId: myCompany._id, status: StatusContract.validate });
    const contractsPendingRequester = await Contrat.find({ requesterId: myCompany._id, status: StatusContract.pending });
    const contractsPendingRequested = await Contrat.find({ requestedId: myCompany._id, status: StatusContract.pending });
    const contractsRejectedRequester = await Contrat.find({ requesterId: myCompany._id, status: StatusContract.rejected });
    const contractsRejectedRequested = await Contrat.find({ requestedId: myCompany._id, status: StatusContract.rejected });

    const validateCompaniesRequester = _.flatten(contractsValidateRequester.map((val) => (val.requestedId.toString())));
    const validateCompaniesRequested = _.flatten(contractsValidateRequested.map((val) => (val.requesterId.toString())));
    const pendingCompaniesRequester = _.flatten(contractsPendingRequester.map((val) => (val.requestedId.toString())));
    const pendingCompaniesRequested = _.flatten(contractsPendingRequested.map((val) => (val.requesterId.toString())));
    const rejectedCompaniesRequester = _.flatten(contractsRejectedRequester.map((val) => (val.requestedId.toString())));
    const rejectedCompaniesRequested = _.flatten(contractsRejectedRequested.map((val) => (val.requesterId.toString())));

    if (statusContract) {
      switch (statusContract) {
        case StatusContract.validate: filter._id = { $in: validateCompaniesRequester.concat(validateCompaniesRequested).map((val) => (mongoose.Types.ObjectId(val))) }; break;
        case StatusContract.pending: filter._id = { $in: pendingCompaniesRequester.concat(pendingCompaniesRequested).map((val) => (mongoose.Types.ObjectId(val))) }; break;
        case StatusContract.rejected: filter._id = { $in: rejectedCompaniesRequester.concat(rejectedCompaniesRequested).map((val) => (mongoose.Types.ObjectId(val))) }; break;
        case StatusContract.opened: filter._id = {
          $nin:
          rejectedCompaniesRequester.concat(
            rejectedCompaniesRequested,
            pendingCompaniesRequester,
            pendingCompaniesRequested,
            validateCompaniesRequester,
            validateCompaniesRequested,
          ).map((val) => (mongoose.Types.ObjectId(val))),
        }; break;

        default: break;
      }
    }
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryId',
        },
      },
      { $unwind: { path: '$countryId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'governorates',
          localField: 'governorateId',
          foreignField: '_id',
          as: 'governorateId',
        },
      },
      { $unwind: { path: '$governorateId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'municipalities',
          localField: 'municipalityId',
          foreignField: '_id',
          as: 'municipalityId',
        },
      },
      { $unwind: { path: '$municipalityId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    let finalData;
    if (data.length) {
      finalData = data.map((val) => ({
        ...val,
        statusContract:
          validateCompaniesRequester.concat(validateCompaniesRequested).includes(val._id.toString()) ? StatusContract.validate
            : rejectedCompaniesRequester.concat(rejectedCompaniesRequested).includes(val._id.toString()) ? StatusContract.rejected
              : pendingCompaniesRequester.concat(pendingCompaniesRequested).includes(val._id.toString()) ? StatusContract.pending
                : null,
        creator: validateCompaniesRequester.concat(rejectedCompaniesRequester, pendingCompaniesRequester).includes(val._id.toString()),
      }));
    }
    res.paginatedContracts = { data: data.length ? finalData : data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedValidateContracts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const country = req.query.country || null;
    const governorate = req.query.governorate || null;
    const municipality = req.query.municipality || null;
    const typeCompany = req.query.typeCompany || null;

    let sortType = {};
    let sortName = {};
    const filter = {};
    if (country) { filter.countryId = mongoose.Types.ObjectId(country); }
    if (governorate) { filter.governorateId = mongoose.Types.ObjectId(governorate); }
    if (municipality) { filter.municipalityId = mongoose.Types.ObjectId(municipality); }
    switch (req.query.sortType) {
      case 'up':
        sortType = { code: 1 };
        break;
      case 'down':
        sortType = { code: -1 };
        break;
      default:
        sortType = { code: -1 };
    }
    switch (req.query.sortName) {
      case 'up':
        sortName = { name: 1 };
        break;
      case 'down':
        sortName = { name: -1 };
        break;
      default:
        sortName = { name: -1 };
    }
    let sort = { ...sortType, ...sortName };
    if (req.query.sortType === 'up' || req.query.sortCode === 'down') {
      sort = { ...sortType };
    }
    if (req.query.sortName === 'up' || req.query.sortName === 'down') {
      sort = { ...sortName };
    }
    let total = 0;
    const myCompany = await Company.findById(req.user.companyId);

    if (typeCompany) { filter.type = typeCompany; } else {
      switch (myCompany.type) {
        case typesCompany.store:
          filter.type = { $in: [typesCompany.factory, typesCompany.supplier] };
          break;
        case typesCompany.supplier:
          filter.type = { $in: [typesCompany.factory] };
          break;
        default:
          break;
      }
    }
    const contractsValidate = await Contrat.find({ companiesId: myCompany._id, status: StatusContract.validate });

    const validateCompanies = _.flatten(contractsValidate.map((val) => (val.companiesId.map((el) => (el.toString())))));
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryId',
        },
      },
      { $unwind: { path: '$countryId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'governorates',
          localField: 'governorateId',
          foreignField: '_id',
          as: 'governorateId',
        },
      },
      { $unwind: { path: '$governorateId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'municipalities',
          localField: 'municipalityId',
          foreignField: '_id',
          as: 'municipalityId',
        },
      },
      { $unwind: { path: '$municipalityId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        },
      },
    ]);
    let finalData;
    if (data.length) {
      finalData = data.map((val) => ({
        ...val,
        statusContract:
          validateCompanies.includes(val._id.toString()) ? StatusContract.validate : null,
      })).filter((val) => (val.statusContract));
      total = finalData.filter((val) => (val.statusContract)).length;
    }
    res.paginatedValidateContracts = { data: data.length ? finalData : data, total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedProductRequest = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const typeRequest = req.query.typeRequest || null;
    const filter = {};
    switch (typeRequest) {
      case 'myRequests': filter.requesterId = mongoose.Types.ObjectId(req.user.companyId); break;
      default: filter.requestedId = mongoose.Types.ObjectId(req.user.companyId); break;
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'requestedId',
          foreignField: '_id',
          as: 'requestedId',
        },
      },
      { $unwind: { path: '$requestedId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companies',
          localField: 'requesterId',
          foreignField: '_id',
          as: 'requesterId',
        },
      },
      { $unwind: { path: '$requesterId', preserveNullAndEmptyArrays: true } },
      { $unwind: '$productsId' },
      {
        $lookup: {
          from: 'products',
          let: {
            productId: { $toObjectId: '$productsId.productId' },
            productsId: '$productsId',
          },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$$productsId', '$$ROOT'] } } },
          ],
          as: 'productsId',
        },
      },
      { $unwind: { path: '$productsId', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          updatedAt: { $first: '$updatedAt' },
          requestedValidation: { $first: '$requestedValidation' },
          requesterValidation: { $first: '$requesterValidation' },
          done: { $first: '$done' },
          dueDate: { $first: '$dueDate' },
          requesterId: { $first: '$requesterId' },
          requestedId: { $first: '$requestedId' },
          productsId: { $push: '$productsId' },
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $count: 'total',
        },
      ]);
    }
    const finalData = data;
    /* if (data.length) {
      finalData = data.map((val) => ({
        ...val,
        quantityInTotal: val.quantityIn.reduce((a, b) => (a + b.quantity), 0),
        totalInPrice: val.quantityIn.reduce((a, b) => (a + (Number(b.quantity) * Number(b.unitPrice))), 0),
        quantityOutTotal: val.quantityOut.reduce((a, b) => (a + b.quantity), 0),
        totalOutPrice: val.quantityOut.reduce((a, b) => (a + (Number(b.quantity) * Number(b.unitPrice))), 0),
      })).map((val) => ({
        ...val,
        quantityTotal: Number(val.quantityInTotal) - Number(val.quantityOutTotal),
      }));
    } */
    res.paginatedProductRequest = { data: finalData, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
const paginatedNewProducts = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const id = req.query.id || null;
    const type = req.query.type || null;
    const company = req.query.company || null;
    const filter = { status: CreateStatusEnum.pending };
    if (type) {
      filter.typeProductId = mongoose.Types.ObjectId(type);
    }
    if (company) {
      filter.companyProductId = mongoose.Types.ObjectId(company);
    }
    const startIndex = (page - 1) * limit;
    let total = [{ total: 0 }];
    const data = await model.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'companyId',
        },
      },
      { $unwind: { path: '$companyId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'typeproducts',
          localField: 'typeProductId',
          foreignField: '_id',
          as: 'typeProductId',
        },
      },
      { $unwind: { path: '$typeProductId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companyproducts',
          localField: 'companyProductId',
          foreignField: '_id',
          as: 'companyProductId',
        },
      },
      { $unwind: { path: '$companyProductId', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { label: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $skip: id ? 0 : startIndex,
      },
      {
        $limit: id ? Infinity : limit,
      },
    ]);
    if (data && data.length > 0) {
      total = await model.aggregate([
        {
          $match: filter,
        },
        {
          $match: {
            $or: [
              { label: { $regex: search, $options: 'i' } },
            ],
          },
        },
        {
          $count: 'total',
        },
      ]);
    }
    res.paginatedNewProducts = { data, total: total[0].total };
    next();
  } catch (e) {
    res.status(500)
      .json({ message: e.message });
  }
};
module.exports = {
  paginatedCompanies,
  paginatedProducts,
  paginatedProductStocks,
  paginatedCategories,
  paginatedUsers,
  paginatedFeatures,
  paginatedGroups,
  paginatedThirdParty,
  paginatedTypeThirdParty,
  paginatedUsersWithFeature,
  paginatedCountries,
  paginatedCompaniesProducts,
  paginatedTypeProducts,
  paginatedContracts,
  paginatedValidateContracts,
  paginatedProductRequest,
  paginatedNewProducts,
};
