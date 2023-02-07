const mongoose = require('mongoose');
const ThirdParty = require('../models/third-party');
const TypeThirdParty = require('../models/third-party-type');
const { errorCatch } = require('../shared/utils');

const addThirdPartyType = async (req, res) => {
  try {
    const {
      typeThirdParty,
    } = req.body;
    for await (const type of typeThirdParty) {
      const existCode = await TypeThirdParty.findOne({ code: type.code, companyId: req.user.companyId });
      if (existCode) {
        return res.status(400).json({
          errors: [
            {
              msg: 'This code already exists',
              param: 'code',
              location: 'body',
            },
          ],
        });
      }
      const newTypeThirdParty = new TypeThirdParty({
        code: type.code,
        label: type.label,
        nature: type.nature,
        suffix: type.suffix,
        length: type.length,
        companyId: req.user.companyId,
        usersCreation: req.user.id,
      });
      await newTypeThirdParty.save();
    }

    return res.status(201).json();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getListThirdPartyTypes = (req, res) => {
  res.json(res.paginatedTypeThirdParty);
};
const updateThirdPartyType = async (req, res) => {
  try {
    const {
      typeThirdParty,
    } = req.body;
    const { code } = typeThirdParty;
    const existCode = await TypeThirdParty.findOne({ _id: { $ne: typeThirdParty._id }, code, companyId: req.user.companyId });
    if (existCode) {
      return res.status(400).json({
        errors: [
          {
            msg: 'This code already exists',
            param: 'code',
            location: 'body',
          },
        ],
      });
    }
    const thirdParty = await ThirdParty.findOne({ thirdPartyTypeId: typeThirdParty._id });
    const updatedTypeThirdParty = await TypeThirdParty.findById(typeThirdParty._id);
    if (thirdParty && (updatedTypeThirdParty.suffix !== typeThirdParty.suffix || updatedTypeThirdParty.length !== typeThirdParty.length)) {
      return res.status(403).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'suffix length',
            location: 'body',
          },
        ],
      });
    }
    updatedTypeThirdParty.code = typeThirdParty.code;
    updatedTypeThirdParty.label = typeThirdParty.label;
    updatedTypeThirdParty.nature = typeThirdParty.nature;
    updatedTypeThirdParty.suffix = typeThirdParty.suffix.length !== 0 ? typeThirdParty.suffix : null;
    updatedTypeThirdParty.length = typeThirdParty.length;
    updatedTypeThirdParty.usersLastUpdate = req.user.id;
    await updatedTypeThirdParty.save();

    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const listTypeThirdParty = async (req, res) => {
  try {
    const typeThirdParty = await TypeThirdParty.find({ companyId: mongoose.Types.ObjectId(req.user.companyId) });
    return res.status(200).json(typeThirdParty);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllThirdPartyTypes = async (req, res) => {
  try {
    const typeThirdParties = await TypeThirdParty.find({ companyId: mongoose.Types.ObjectId(req.user.companyId) });
    return res.status(200).json(typeThirdParties);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const deleteThirdPartyType = async (req, res) => {
  try {
    const typeThirdParty = await TypeThirdParty.findByIdAndDelete(req.params.id);
    if (!typeThirdParty) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getThirdPartyTypeNature = async (req, res) => {
  try {
    const typeThirdParty = await TypeThirdParty.find({ nature: req.params.nature, companyId: mongoose.Types.ObjectId(req.user.companyId) });
    const arrayOfId = typeThirdParty.map((element) => element._id);
    return res.status(201).json(arrayOfId);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllThirdPartyByNature = async (req, res) => {
  try {
    const typeThirdParties = await TypeThirdParty.find({ nature: req.params.nature, companyId: mongoose.Types.ObjectId(req.user.companyId) });
    return res.status(201).json(typeThirdParties);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getListCustomerSupplier = async (req, res) => {
  try {
    const typeThirdParties = await TypeThirdParty.find({ nature: req.params.nature, companyId: mongoose.Types.ObjectId(req.user.companyId) });
    const thirdPartyTypeIds = typeThirdParties.map((element) => element._id);
    const filter = { companyId: mongoose.Types.ObjectId(req.user.companyId), thirdPartyTypeId: { $in: thirdPartyTypeIds } };
    const thirdParties = await ThirdParty.find(filter);
    return res.status(200).json(thirdParties);
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addThirdPartyType,
  getListThirdPartyTypes,
  updateThirdPartyType,
  listTypeThirdParty,
  getAllThirdPartyTypes,
  deleteThirdPartyType,
  getThirdPartyTypeNature,
  getAllThirdPartyByNature,
  getListCustomerSupplier,
};
