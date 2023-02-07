const mongoose = require('mongoose');
const ThirdParty = require('../models/third-party');
const TypeThirdParty = require('../models/third-party-type');
const { errorCatch } = require('../shared/utils');
const { natures } = require('../shared/enums');

const addThirdParty = async (req, res) => {
  try {
    const {
      thirdParty,
    } = req.body;
    const newThirdParty = new ThirdParty({
      companyId: req.user.companyId,
      thirdPartyTypeId: thirdParty.thirdPartyTypeId._id,
      code: thirdParty.code,
      nature: thirdParty.nature,
      typeIdentifier: thirdParty.typeIdentifier,
      identifier: thirdParty.identifier,
      usersCreation: req.user.id,
    });
    if (thirdParty.address) {
      newThirdParty.address = thirdParty.address;
    }
    if (thirdParty.postalCode) {
      newThirdParty.postalCode = thirdParty.postalCode;
    }
    if (thirdParty.phone) {
      newThirdParty.phone = thirdParty.phone;
    }
    if (thirdParty.fax) {
      newThirdParty.fax = thirdParty.fax;
    }
    if (thirdParty.email) {
      newThirdParty.email = thirdParty.email.toLowerCase();
    }
    if (thirdParty.nature === natures.physical && thirdParty.firstName) {
      newThirdParty.firstName = thirdParty.firstName;
    }
    if (thirdParty.nature === natures.physical && thirdParty.lastName) {
      newThirdParty.lastName = thirdParty.lastName;
    }
    if (thirdParty.nature === natures.physical) {
      newThirdParty.label = `${thirdParty.lastName} ${thirdParty.firstName}`;
    }
    if (thirdParty.nature === natures.moral && thirdParty.label) {
      newThirdParty.label = thirdParty.label;
    }
    if (thirdParty.email) {
      newThirdParty.email = thirdParty.email.toLowerCase();
    }
    if (thirdParty.webSite) {
      newThirdParty.webSite = thirdParty.webSite;
    }
    if (thirdParty.managerName) {
      newThirdParty.managerName = thirdParty.managerName;
    }
    if (thirdParty.activityDomain) {
      newThirdParty.activityDomain = thirdParty.activityDomain;
    }
    if (thirdParty.gender) {
      newThirdParty.gender = thirdParty.gender;
    }
    await newThirdParty.save();

    return res.status(200).json(newThirdParty);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getThirdPartiesList = (req, res) => {
  res.json(res.paginatedThirdParty);
};
const updateThirdParty = async (req, res) => {
  try {
    const {
      thirdParty,
    } = req.body;
    const updatedThirParty = await ThirdParty.findByIdAndUpdate(thirdParty._id,
      {
        companyId: req.user.companyId,
        thirdPartyTypeId: thirdParty.thirdPartyTypeId._id,
        code: thirdParty.code,
        nature: thirdParty.nature,
        typeIdentifier: thirdParty.typeIdentifier,
        identifier: thirdParty.identifier,
        usersLastUpdate: req.user.id,
      });
    if (thirdParty.address) {
      updatedThirParty.address = thirdParty.address;
    } else {
      updatedThirParty.address = null;
    }
    if (thirdParty.postalCode) {
      updatedThirParty.postalCode = thirdParty.postalCode;
    } else {
      updatedThirParty.postalCode = null;
    }
    if (thirdParty.phone) {
      updatedThirParty.phone = thirdParty.phone;
    } else {
      updatedThirParty.phone = null;
    }
    if (thirdParty.fax) {
      updatedThirParty.fax = thirdParty.fax;
    } else {
      updatedThirParty.fax = null;
    }
    if (thirdParty.email) {
      updatedThirParty.email = thirdParty.email.toLowerCase();
    } else {
      updatedThirParty.email = null;
    }
    if (thirdParty.nature === natures.physical && thirdParty.firstName) {
      updatedThirParty.firstName = thirdParty.firstName;
    } else {
      updatedThirParty.firstName = null;
    }
    if (thirdParty.nature === natures.physical && thirdParty.lastName) {
      updatedThirParty.lastName = thirdParty.lastName;
    } else {
      updatedThirParty.lastName = null;
    }
    if (thirdParty.nature === natures.physical) {
      updatedThirParty.label = `${thirdParty.lastName} ${thirdParty.firstName}`;
    }
    if (thirdParty.nature === natures.moral && thirdParty.label) {
      updatedThirParty.label = thirdParty.label;
    }
    if (thirdParty.webSite) {
      updatedThirParty.webSite = thirdParty.webSite;
    } else {
      updatedThirParty.webSite = null;
    }
    if (thirdParty.managerName) {
      updatedThirParty.managerName = thirdParty.managerName;
    } else {
      updatedThirParty.managerName = null;
    }
    if (thirdParty.activityDomain) {
      updatedThirParty.activityDomain = thirdParty.activityDomain;
    } else {
      updatedThirParty.activityDomain = null;
    }
    if (thirdParty.gender) {
      updatedThirParty.gender = thirdParty.gender;
    } else {
      updatedThirParty.gender = null;
    }
    await updatedThirParty.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const listThirdParty = async (req, res) => {
  try {
    const thirdParty = await ThirdParty.find();
    return res.status(200).json(thirdParty);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleThirdParty = async (req, res) => {
  try {
    const thirdParty = await ThirdParty.findById(req.params.id).populate('thirdPartyTypeId');
    if (!thirdParty) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(200).json(thirdParty);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const deleteThirdParty = async (req, res) => {
  try {
    const thirdParty = await ThirdParty.findByIdAndDelete(req.params.id);
    if (!thirdParty) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const lastThirdPartySequence = async (req, res) => {
  try {
    let code;
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const thirdParty = await ThirdParty.findOne({ thirdPartyTypeId: req.params.id }, {}, { sort: { code: -1 } }).populate('thirdPartyTypeId');
    if (thirdParty) {
      code = (thirdParty.thirdPartyTypeId.suffix ? thirdParty.thirdPartyTypeId.suffix : '')
        + zeroPad((Number(thirdParty.code.slice(thirdParty.code.length - thirdParty.thirdPartyTypeId.length, thirdParty.code.length)) + 1), thirdParty.thirdPartyTypeId.length);
    } else {
      const typeThirdParty = await TypeThirdParty.findById(req.params.id);
      if (typeThirdParty.length) {
        code = zeroPad(1, typeThirdParty.length);
      }
      if (typeThirdParty.suffix) {
        code = typeThirdParty.suffix + code;
      }
    }
    return res.status(201).json(code);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllThirdParties = async (req, res) => {
  try {
    const thirdParty = await ThirdParty.find({ thirdPartyTypeId: req.params.id });
    return res.status(200).json(thirdParty);
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addThirdParty,
  getThirdPartiesList,
  updateThirdParty,
  listThirdParty,
  getSingleThirdParty,
  deleteThirdParty,
  lastThirdPartySequence,
  getAllThirdParties,
};
