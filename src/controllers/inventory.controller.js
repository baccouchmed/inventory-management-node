const moment = require('moment');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const CompanyProduct = require('../models/company-product');
const ProductStock = require('../models/product-stock');
const ProductStore = require('../models/product-store');
const { errorCatch } = require('../shared/utils');

const addCategory = async (req, res) => {
  try {
    const {
      category,
    } = req.body;
    const newCategory = new Category({
      companyId: req.user.companyId,
      label: category.label,
      logo: category.logo,
    });

    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const addSubcategory = async (req, res) => {
  try {
    const {
      subcategory,
    } = req.body;
    const newSubcategory = new Subcategory({
      companyId: req.user.companyId,
      categoryId: subcategory.categoryId,
      label: subcategory.label,
      logo: subcategory.logo,
    });

    await newSubcategory.save();
    return res.status(201).json(newSubcategory);
  } catch (e) {
    return errorCatch(e, res);
  }
};
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
const addInventory = async (req, res) => {
  try {
    const {
      category,
      subcategories,
      products,
    } = req.body;
    const newCategory = new Category({
      companyId: req.user.companyId,
      label: category.label,
    });
    await newCategory.save();
    if (subcategories && subcategories.length) {
      for await (const [index, subcategory] of subcategories.entries()) {
        const newSubcategory = new Subcategory({
          companyId: req.user.companyId,
          categoryId: newCategory._id,
          label: subcategory.label,
        });
        await newSubcategory.save();
        for await (const product of products[index]) {
          const newProduct = new Product({
            companyId: req.user.id,
            categoryId: newCategory._id,
            subcategoryId: newSubcategory._id,
            companyProductId: product.companyProductId._id,
            typeProductId: product.typeProductId._id,
            label: product.label,
          });
          await newProduct.save();
        }
      }
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getCategories = (req, res) => {
  res.json(res.paginatedCategories);
};
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(200).json(category);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ categoryId: req.params.id });
    if (!subcategories) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    const products = [];
    for await (const subcategory of subcategories) {
      const prods = await Product.find({ subcategoryId: subcategory._id });
      products.push(prods);
    }
    return res.status(200).json({ subcategories, products });
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
    console.log('********', productStock);

    if (productStock) {
      productStock.quantityIn = productStock.quantityIn.concat([{
        quantity: quantityIn,
        date: moment().format(),
        unitPrice,
        totalPrice: (Number(unitPrice) * Number(quantityIn)).toFixed(3),
      }]);
      await productStock.save();
    } else {
      const product = await Product.findById(req.params.id);
      await ProductStock.create({
        companyId: req.user.companyId,
        companyProductId: product.companyProductId,
        typeProductId: product.typeProductId,
        companyProductTypeProductId: product.companyProductTypeProductId,
        productId: req.params.id,
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
      await productStock.save();
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

const updatePrice = async (req, res) => {
  try {
    console.log(req.params.id);
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
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  addCategory,
  addSubcategory,
  addProduct,
  addCompanyProduct,
  addInventory,
  getCategories,
  getCategory,
  getSubcategories,
  addStock,
  updatePrice,
  updateMinStock,
  deductStock,
  updateStore,
};
