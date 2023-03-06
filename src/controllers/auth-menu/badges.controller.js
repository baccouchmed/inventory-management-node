const mongoose = require('mongoose');
const ProductStock = require('../../models/sgs/product-stock');
const ProductStore = require('../../models/sgs/product-store');
const { errorCatch } = require('../../shared/utils');
const ProductRequest = require('../../models/sgs/product-request');

const badgeStocks = async (req, res) => {
  try {
    const badgeStock = await ProductStock.find({
      companyId: mongoose.Types.ObjectId(req.user.companyId),
      minStock: { $exists: true },
      inStock: { $exists: true },
      $expr: { $gt: ['$minStock', '$inStock'] },
    }).countDocuments();
    return res.status(200).json(badgeStock);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const badgeStores = async (req, res) => {
  try {
    const store = await ProductStore.find({
      companyId: mongoose.Types.ObjectId(req.user.companyId),
    });
    const badgeStore = await ProductStock.find({
      companyId: mongoose.Types.ObjectId(req.user.companyId),
      productId: { $in: store.map((val) => (mongoose.Types.ObjectId(val.productId))) },
      inStock: { $lte: 0 },
    }).countDocuments();
    return res.status(200).json(badgeStore);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const badgeMyRequests = async (req, res) => {
  try {
    const badgeMyRequest = await ProductRequest.find({
      requesterId: mongoose.Types.ObjectId(req.user.companyId),
      requestedValidation: true,
      $or: [{ requesterValidation: false }, { requesterValidation: { $exists: false } }],
    }).countDocuments();
    return res.status(200).json(badgeMyRequest);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const badgeStockRequests = async (req, res) => {
  try {
    const badgeStockRequest = await ProductRequest.find({
      requestedId: mongoose.Types.ObjectId(req.user.companyId),
      $or: [{ requestedValidation: false }, { requestedValidation: { $exists: false } }],
    }).countDocuments();
    return res.status(200).json(badgeStockRequest);
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  badgeStocks, badgeMyRequests, badgeStockRequests, badgeStores,
};
