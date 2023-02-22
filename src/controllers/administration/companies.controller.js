const {
  body, validationResult,
} = require('express-validator');
const { errorCatch } = require('../../shared/utils');
const Company = require('../../models/administration/company');
const User = require('../../models/administration/user');
const Group = require('../../models/administration/group');
const ParamProject = require('../../models/administration/paramProject');

const addCompany = async (req, res) => {
  try {
    if (req.body.company && req.body.company.email) {
      await body('company.email', 'Invalid mail format').isEmail()
        .run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      company,
    } = req.body;
    const existCode = await Company.findOne({
      code: company.code,
    });
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
    const newCompany = new Company({
      code: company.code,
      name: company.name,
      type: company.type,
      usersCreation: req.user.id,
      countryId: company.countryId._id,
      governorateId: company.governorateId._id,
      municipalityId: company.municipalityId._id,
    });
    if (company.address) {
      newCompany.address = company.address;
    }
    if (company.phone) {
      newCompany.phone = company.phone;
    }
    if (company.email) {
      newCompany.email = company.email.toLowerCase();
    }
    if (company.postalCode) {
      newCompany.postalCode = company.postalCode;
    }
    if (company.identifier) {
      newCompany.identifier = company.identifier;
    }
    if (company.fax) {
      newCompany.fax = company.fax;
    }
    await newCompany.save();
    const paramProject = await ParamProject.create({
      companyId: newCompany._id,
      codeAttemptNumber: null,
      codeExpirationTime: null,
      suspendPassword: false,
      usersCreation: req.user.id,
      suffixContactCode: null,
      lengthContactCode: null,
    });
    await paramProject.save();

    return res.status(200).json(newCompany);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllCompanyPagination = (req, res) => {
  res.json(res.paginatedCompanies);
};
const getAllContractsPagination = (req, res) => {
  res.json(res.paginatedContracts);
};
const getAllValidateContractsPagination = (req, res) => {
  res.json(res.paginatedValidateContracts);
};

const updateCompany = async (req, res) => {
  try {
    if (req.body.company && req.body.company.email) {
      await body('company.email', 'Invalid mail format').isEmail()
        .run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      company,
    } = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(company._id,
      {
        name: company.name,
        usersLastUpdate: req.user.id,
      });
    if (company.address) {
      updatedCompany.address = company.address;
    } else {
      updatedCompany.address = null;
    }
    if (company.phone) {
      updatedCompany.phone = company.phone;
    } else {
      updatedCompany.phone = null;
    }
    if (company.email) {
      updatedCompany.email = company.email.toLowerCase();
    } else {
      updatedCompany.email = null;
    }
    if (company.countryId) {
      updatedCompany.countryId = company.countryId._id;
    } else {
      updatedCompany.countryId = null;
    }
    if (company.governorateId) {
      updatedCompany.governorateId = company.governorateId._id;
    } else {
      updatedCompany.governorateId = null;
    }
    if (company.municipalityId) {
      updatedCompany.municipalityId = company.municipalityId._id;
    } else {
      updatedCompany.municipalityId = null;
    }
    if (company.postalCode) {
      updatedCompany.postalCode = company.postalCode;
    } else {
      updatedCompany.postalCode = null;
    }
    if (company.identifier) {
      updatedCompany.identifier = company.identifier;
    } else {
      updatedCompany.identifier = null;
    }
    if (company.fax) {
      updatedCompany.fax = company.fax;
    } else {
      updatedCompany.fax = null;
    }
    if (company.currencyId) {
      updatedCompany.currencyId = company.currencyId._id;
    } else {
      updatedCompany.currencyId = null;
    }
    if (company.defaultLocal) {
      updatedCompany.defaultLocal = company.defaultLocal._id;
    } else {
      updatedCompany.defaultLocal = null;
    }
    await updatedCompany.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (e) {
    return errorCatch(e, res);
  }
};

const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId).populate('countryId governorateId municipalityId');
    if (!company) {
      return res.status(404).json({
        message: '404 not found',
      });
    }

    return res.status(200).json(company);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('countryId governorateId municipalityId');
    if (!company) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(200).json(company);
  } catch (e) {
    return errorCatch(e, res);
  }
};

const deleteCompany = async (req, res) => {
  try {
    const users = await User.find({ companyId: req.params.id });
    if (users && users.length) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'User',
            location: 'body',
          },
        ],
      });
    }
    const groups = await Group.find({ companyId: req.params.id });
    if (groups && groups.length) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'Group',
            location: 'body',
          },
        ],
      });
    }
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateLogo = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(400).send({
        errors: [
          {
            msg: 'Id user ne correspondent pas',
            param: 'id',
            location: 'token',
          },
        ],
      });
    }

    company.logo = req.file.filename;

    await company.save();

    return res.status(200).json(company);
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addCompany,
  getAllCompanyPagination,
  getAllContractsPagination,
  getAllValidateContractsPagination,
  updateCompany,
  getAllCompany,
  getMyCompany,
  getCompany,
  deleteCompany,
  updateLogo,
};
