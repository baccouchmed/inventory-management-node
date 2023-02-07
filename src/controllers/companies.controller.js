const {
  body, validationResult,
} = require('express-validator');
const { errorCatch } = require('../shared/utils');
const Company = require('../models/company');
const Group = require('../models/group');
const User = require('../models/user');
const ParamProject = require('../models/paramProject');

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
};/*
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
            sites,
            deletedSites,
        } = req.body;
        for await (const deletedSite of deletedSites) {
            const userSites = await UserSite.find({ siteId: deletedSite });
            if (userSites && userSites.length) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'There is child data related to this record.',
                            param: 'site',
                            location: 'body',
                        },
                    ],
                });
            }
        }
        const updatedCompany = await Company.findByIdAndUpdate(company._id,
            {
                code: company.code,
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
        if (company.cityId) {
            updatedCompany.cityId = company.cityId._id;
        } else {
            updatedCompany.cityId = null;
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
        for await (const site of sites) {
            if (site._id) {
                await Site.findByIdAndUpdate(site._id, {
                    code: site.code,
                    label: site.label,
                    address: site.address,
                    countryId: site.countryId._id,
                    cityId: site.cityId._id,
                    userLastUpdate: req.user.id,
                });
            } else if (
                site.code
                && site.label
                && site.address
                && site.countryId
                && site.cityId
            ) {
                const newSite = new Site({
                    code: site.code,
                    label: site.label,
                    address: site.address,
                    countryId: site.countryId._id,
                    cityId: site.cityId._id,
                    usersCreation: req.user.id,
                    companyId: company._id,
                });
                await newSite.save();
            }
        }
        for await (const deletedSite of deletedSites) {
            await Site.findByIdAndDelete(deletedSite);
        }
        return res.status(204).end();
    } catch (e) {
        return errorCatch(e, res);
    }
}; */
const getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (e) {
    return errorCatch(e, res);
  }
};
/*
const getMyCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.user.companyId).populate('countryId cityId currencyId');
        if (!company) {
            return res.status(404).json({
                message: '404 not found',
            });
        }
        let dataCompany = company._doc;
        if (company.defaultLocal) {
            const data = await getLocal(company.defaultLocal);
            if (data) {
                dataCompany = { ...company._doc, defaultLocal: data };
            }
        }

        return res.status(200).json(dataCompany);
    } catch (e) {
        return errorCatch(e, res);
    }
}; */
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
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
/*
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
        await Site.deleteMany({ companyId: req.params.id });
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
*/
module.exports = {
  addCompany,
  getAllCompanyPagination,
  // updateCompany,
  getAllCompany,
  // getMyCompany,
  getCompany,
  // deleteCompany,
  // updateLogo,
};
