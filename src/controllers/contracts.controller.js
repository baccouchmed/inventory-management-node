const mongoose = require('mongoose');
const Contract = require('../models/contract');
const { errorCatch } = require('../shared/utils');
const { StatusContract } = require('../shared/enums');

const addContract = async (req, res) => {
  try {
    const {
      company,
    } = req.body;

    const existContract = await Contract.findOne({ companiesId: [company, mongoose.Types.ObjectId(req.user.companyId)] });
    if (existContract) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This record already exists',
            param: 'company',
            location: 'body',
          },
        ],
      });
    }
    const newContract = new Contract({
      status: StatusContract.pending,
      companiesId: [company, mongoose.Types.ObjectId(req.user.companyId)],
      requesterId: mongoose.Types.ObjectId(req.user.companyId),
      requestedId: company,
    });
    await newContract.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const refreshContract = async (req, res) => {
  try {
    const {
      company,
    } = req.body;

    const existContract = await Contract.findOne({ status: StatusContract.rejected, companiesId: { $all: [mongoose.Types.ObjectId(company), mongoose.Types.ObjectId(req.user.companyId)] } });
    if (!existContract) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This record doesn\'t exists',
            param: 'company',
            location: 'body',
          },
        ],
      });
    }
    existContract.status = StatusContract.pending;
    await existContract.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const revokeContract = async (req, res) => {
  try {
    const {
      company,
    } = req.body;

    const existContract = await Contract.findOne({ status: { $in: [StatusContract.validate, StatusContract.pending] }, companiesId: { $all: [mongoose.Types.ObjectId(company), mongoose.Types.ObjectId(req.user.companyId)] } });
    if (!existContract) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This record doesn\'t exists',
            param: 'company',
            location: 'body',
          },
        ],
      });
    }
    existContract.status = StatusContract.rejected;
    await existContract.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const validateContract = async (req, res) => {
  try {
    const {
      company,
    } = req.body;

    const existContract = await Contract.findOne({ status: { $in: [StatusContract.pending] }, companiesId: { $all: [mongoose.Types.ObjectId(company), mongoose.Types.ObjectId(req.user.companyId)] } });
    if (!existContract) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This record doesn\'t exists',
            param: 'company',
            location: 'body',
          },
        ],
      });
    }
    existContract.status = StatusContract.validate;
    await existContract.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addContract, refreshContract, revokeContract, validateContract,
};
