const {
  body, validationResult,
} = require('express-validator');
const { errorCatch } = require('../shared/utils');
const CompanyProduct = require('../models/company-product');
const CompanyProductTypeProduct = require('../models/companyProduct-typeProduct');
const Product = require('../models/product');
const TypeProduct = require('../models/type-product');

const addCompany = async (req, res) => {
  try {
    const {
      company,
      typeProducts,
      products,
    } = req.body;
    const newCompany = new CompanyProduct({
      companyId: req.user.companyId,
      name: company.name,
    });
    await newCompany.save();
    if (typeProducts && typeProducts.length) {
      for await (const [index, typeProduct] of typeProducts.entries()) {
        const newTypeProduct = new CompanyProductTypeProduct({
          companyId: req.user.companyId,
          companyProductId: newCompany._id,
          typeProductId: typeProduct._id,
        });
        await newTypeProduct.save();
        for await (const product of products[index]) {
          const newProduct = new Product({
            companyId: req.user.id,
            companyProductId: newCompany._id,
            typeProductId: typeProduct._id,
            companyProductTypeProductId: newTypeProduct._id,
            label: product.label,
          });
          await newProduct.save();
        }
      }
    }
    return res.status(201).json(newCompany);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllCompanyPagination = (req, res) => {
  res.json(res.paginatedCompaniesProducts);
};
const getAllProductPagination = (req, res) => {
  res.json(res.paginatedProducts);
};
const getAllProductStockPagination = (req, res) => {
  res.json(res.paginatedProductStocks);
};
const updateCompany = async (req, res) => {
  try {
    const {
      company,
      typeProducts,
      products,
    } = req.body;
    await CompanyProduct.findByIdAndUpdate(company._id,
      {
        name: company.name,
      });
    const existCompanyProductTypeProducts = await CompanyProductTypeProduct.find({ companyProductId: company._id }).populate('typeProductId');
    for await (const existCompanyProductTypeProduct of existCompanyProductTypeProducts) {
      const listTypeProducts = typeProducts.filter((val) => (val._id));
      if (listTypeProducts.length) {
        if (!listTypeProducts.map((val) => (val._id.toString())).includes(existCompanyProductTypeProduct.typeProductId._id.toString())) {
          const product = await Product.find({ typeProductId: existCompanyProductTypeProduct.typeProductId._id });
          if (!product.length) {
            await CompanyProductTypeProduct.deleteOne({ typeProductId: existCompanyProductTypeProduct.typeProductId._id });
          }
        }
      }
    }

    for await (const [index, typeProduct] of typeProducts.entries()) {
      if (typeProduct && typeProduct._id) {
        const filter = existCompanyProductTypeProducts
          .filter((val) => (val.typeProductId._id.toString()) === typeProduct._id.toString());
        if (!filter.length) {
          const newCompanyProductTypeProduct = new CompanyProductTypeProduct({
            companyProductId: company._id,
            typeProductId: typeProduct._id,
            companyId: req.user.companyId,
          });
          await newCompanyProductTypeProduct.save();
          for await (const product of products[index]) {
            const newProduct = new Product({
              companyId: req.user.id,
              companyProductId: company._id,
              typeProductId: typeProduct._id,
              companyProductTypeProductId: newCompanyProductTypeProduct._id,
              label: product.label,
            });
            await newProduct.save();
          }
        } else {
          for await (const product of products[index]) {
            if (!product._id) {
              const newProduct = new Product({
                companyId: req.user.id,
                companyProductId: company._id,
                typeProductId: typeProduct._id,
                companyProductTypeProductId: filter[0]._id,
                label: product.label,
              });
              await newProduct.save();
            }
          }
        }
      }
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const getAllCompany = async (req, res) => {
  try {
    const companies = await CompanyProduct.find();
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
*/
const updateLogo = async (req, res) => {
  try {
    const company = await CompanyProduct.findById(req.params.id);

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
const updateProductLogo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
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

    product.logo = req.file.filename;

    await product.save();

    return res.status(200).json(product);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getTypeProducts = async (req, res) => {
  try {
    const typeProducts = await TypeProduct.find({
      companyProductId: req.params.id,
    });
    return res.status(200).json(typeProducts);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addTypeProduct = async (req, res) => {
  try {
    const {
      stages,
    } = req.body;
    for await (const stage of stages) {
      if (stage.label) {
        const newStage = new TypeProduct({
          companyId: req.user.companyId,
          label: stage.label,
          usersCreation: req.user.id,
        });
        await newStage.save();
      }
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const getAllTypeProducts = async (req, res) => {
  try {
    const stages = await TypeProduct.find({ companyId: req.user.companyId });
    return res.status(200).json(stages);
  } catch (e) {
    return errorCatch(e, res);
  }
};

const deleteTypeProduct = async (req, res) => {
  try {
    const products = await Product.find({ typeProductId: req.params.id });
    if (products && products.length) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is child data related to this record.',
            param: 'id',
            location: 'params',
          },
        ],
      });
    }
    const stage = await TypeProduct.findOneAndDelete({
      _id: req.params.id, companyId: req.user.companyId,
    });
    if (!stage) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const updateTypeProduct = async (req, res) => {
  try {
    const {
      stage,
    } = req.body;
    await TypeProduct.findOneAndUpdate({
      _id: stage._id, companyId: req.user.companyId,
    },
    {
      label: stage.label,
      usersLastUpdate: req.user.id,
    });
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await CompanyProduct.findById(req.params.id);
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
const getCompanyTypeProducts = async (req, res) => {
  try {
    const companyProductTypeProducts = await CompanyProductTypeProduct.find({ companyProductId: req.params.id }).populate('typeProductId');
    if (!companyProductTypeProducts) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    const products = [];
    for await (const companyProductTypeProduct of companyProductTypeProducts) {
      const prods = await Product.find({ companyProductTypeProductId: companyProductTypeProduct._id });
      products.push(prods);
    }
    return res.status(200).json({
      companyProductTypeProducts: companyProductTypeProducts.length
        ? companyProductTypeProducts.map((val) => (val.typeProductId)) : [],
      products,
    });
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  addCompany,
  getAllCompanyPagination,
  updateCompany,
  getAllCompany,
  // getMyCompany,
  getCompany,
  // deleteCompany,
  updateLogo,
  getTypeProducts,
  addTypeProduct,
  updateTypeProduct,
  deleteTypeProduct,
  getAllTypeProducts,
  getCompanyTypeProducts,
  updateProductLogo,
  getAllProductPagination,
  getAllProductStockPagination,
};
