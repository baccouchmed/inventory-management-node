const mongoose = require('mongoose');
const UserFeature = require('../models/user-feature');
const ProductStock = require('../models/product-stock');
const ProductStore = require('../models/product-store');
const Company = require('../models/company');
const { typesCompany } = require('../shared/enums');

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
    const filter = {};
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
    let finalData = data;
    if (data.length) {
      for await (const [index, product] of data.entries()) {
        const productStock = await ProductStock.findOne({ companyId: req.user.companyId, productId: product._id });
        const productStore = await ProductStore.findOne({ companyId: req.user.companyId, productId: product._id });
        finalData[index] = {
          ...product,
          quantityInTotal: productStock && productStock.quantityIn.length ? productStock.quantityIn.reduce((a, b) => (a + b.quantity), 0) : 0,
          quantityOutTotal: productStock && productStock.quantityOut.length ? productStock.quantityOut.reduce((a, b) => (a + b.quantity), 0) : 0,
          status: productStore !== null,
        };
      }
      finalData = finalData.map((val) => ({
        ...val,
        myStock: Number(val.quantityInTotal) - Number(val.quantityOutTotal),
      }));
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
    const filter = { companyId: mongoose.Types.ObjectId(req.user.companyId) };
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
    let sortType = {};
    let sortName = {};
    const filter = {};
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
    res.paginatedContracts = { data, total: total[0].total };
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
};
