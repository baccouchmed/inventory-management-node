const moment = require('moment');
const Product = require('../../models/setting/product');
const CompanyProduct = require('../../models/setting/company-product');
const ProductStock = require('../../models/sgs/product-stock');
const ProductStore = require('../../models/sgs/product-store');
const { errorCatch } = require('../../shared/utils');
const { CreateStatusEnum } = require('../../shared/enums');

const addCompanyProduct = async (req, res) => {
  try {
    const {
      companyProduct,
    } = req.body;
    const newCompanyProduct = new CompanyProduct({
      companyId: req.user.companyId,
      categoryId: companyProduct.categoryId,
      subcategoryId: companyProduct.subcategoryId,
      label: companyProduct.label,
      logo: companyProduct.logo,
    });

    await newCompanyProduct.save();
    return res.status(201).json(newCompanyProduct);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addProduct = async (req, res) => {
  try {
    const {
      product,
    } = req.body;
    const newProduct = new Product({
      companyId: req.user.companyId,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      label: product.label,
      logo: product.logo,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      product,
    } = req.body;
    const newProduct = new Product({
      companyId: req.user.companyId,
      label: product.label,
      status: CreateStatusEnum.pending,
      companyProductIdNew: product.companyProductIdNew,
      typeProductIdNew: product.typeProductIdNew,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addStock = async (req, res) => {
  try {
    const {
      quantityIn,
      unitPrice,
    } = req.body;
    const productStock = await ProductStock.findOne({ productId: req.params.id, companyId: req.user.companyId });

    if (productStock) {
      productStock.quantityIn = productStock.quantityIn.concat([{
        quantity: quantityIn,
        date: moment().format(),
        unitPrice,
        totalPrice: (Number(unitPrice) * Number(quantityIn)).toFixed(3),
      }]);
      productStock.inStock += quantityIn;
      await productStock.save();
    } else {
      const product = await Product.findById(req.params.id);
      await ProductStock.create({
        companyId: req.user.companyId,
        companyProductId: product.companyProductId,
        typeProductId: product.typeProductId,
        companyProductTypeProductId: product.companyProductTypeProductId,
        productId: req.params.id,
        inStock: quantityIn,
        quantityIn: [{
          quantity: quantityIn,
          date: moment().format(),
          unitPrice,
          totalPrice: (Number(unitPrice) * Number(quantityIn)).toFixed(3),
        }],
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const deductStock = async (req, res) => {
  try {
    const {
      quantityOut,
    } = req.body;
    const productStock = await ProductStock.findById(req.params.id);
    if (productStock) {
      productStock.quantityOut = productStock.quantityOut.concat([{
        quantity: quantityOut,
        date: moment().format(),
        unitPrice: productStock.price,
        totalPrice: (Number(productStock.price) * Number(quantityOut)).toFixed(3),
      }]);
      productStock.inStock -= quantityOut;

      await productStock.save();
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const updatePrice = async (req, res) => {
  try {
    await ProductStock.findByIdAndUpdate(req.params.id, { price: req.body.price });

    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const updateMinStock = async (req, res) => {
  try {
    await ProductStock.findByIdAndUpdate(req.params.id, { minStock: req.body.minStock });

    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateStore = async (req, res) => {
  try {
    const { disable } = req.body;
    if (disable) {
      await ProductStore.deleteOne({ productId: req.params.id, companyId: req.user.companyId });
      return res.status(204).end();
    }
    await ProductStore.create({ productId: req.params.id, companyId: req.user.companyId });
    const existProductStock = await ProductStock.findOne(
      { productId: req.params.id, companyId: req.user.companyId },
    );
    if (!existProductStock) {
      const product = await Product.findById(req.params.id);
      await ProductStock.create({
        companyId: req.user.companyId,
        companyProductId: product.companyProductId,
        typeProductId: product.typeProductId,
        companyProductTypeProductId: product.companyProductTypeProductId,
        productId: product._id,
        minStock: 0,
        inStock: 0,
        price: 0,
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addProduct,
  addCompanyProduct,
  addStock,
  updatePrice,
  updateMinStock,
  deductStock,
  updateStore,
  createProduct,
};
