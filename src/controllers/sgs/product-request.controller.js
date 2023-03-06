const moment = require('moment');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const ProductRequest = require('../../models/sgs/product-request');
const ProductStock = require('../../models/sgs/product-stock');
const { errorCatch, pdfHeaderFooter, zeroPad } = require('../../shared/utils');
const { createInvoice } = require('../../services/pdf-creator');

const addProductRequest = async (req, res) => {
  try {
    const {
      productRequest,
    } = req.body;
    const newProductRequest = new ProductRequest({
      requesterId: req.user.companyId,
      requestedId: productRequest.requestedId,
      productsId: productRequest.productsId,
      dueDate: moment(productRequest.dueDate).format(),
    });

    await newProductRequest.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getAllProductRequest = (req, res) => {
  res.json(res.paginatedProductRequest);
};
const updateQuantity = async (req, res) => {
  try {
    const {
      quantityRequested,
    } = req.body;
    const updatedProductRequest = await ProductRequest.findOne(
      {
        _id: req.params.productRequest,
        'productsId.productId': req.params.id,
      },
    );
    if (quantityRequested === 0) {
      updatedProductRequest.productsId = updatedProductRequest.productsId.filter((val) => val.productId.toString() !== req.params.id);
    } else {
      updatedProductRequest.productsId[
        updatedProductRequest.productsId.map((val) => val.productId).indexOf(req.params.id)
      ].quantityRequested = quantityRequested;
    }

    await updatedProductRequest.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const validateQuantity = async (req, res) => {
  try {
    const {
      quantityValidated,
    } = req.body;
    const updatedProductRequest = await ProductRequest.findOne(
      {
        _id: req.params.productRequest,
        'productsId.productId': req.params.id,
      },
    );
    updatedProductRequest.productsId[
      updatedProductRequest.productsId.map((val) => val.productId).indexOf(req.params.id)
    ].quantityValidated = quantityValidated;

    await updatedProductRequest.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const validateUnitPrice = async (req, res) => {
  try {
    const {
      unitPriceRequested,
    } = req.body;
    const updatedProductRequest = await ProductRequest.findOne(
      {
        _id: req.params.productRequest,
        'productsId.productId': req.params.id,
      },
    );
    updatedProductRequest.productsId[
      updatedProductRequest.productsId.map((val) => val.productId).indexOf(req.params.id)
    ].unitPriceRequested = unitPriceRequested;

    await updatedProductRequest.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const requestedValidate = async (req, res) => {
  try {
    const {
      productsId,
    } = req.body;
    const updatedProductRequest = await ProductRequest.findById(req.params.productRequest);
    updatedProductRequest.productsId = productsId;
    updatedProductRequest.requestedValidation = true;

    await updatedProductRequest.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const requesterValidate = async (req, res) => {
  try {
    const updatedProductRequest = await ProductRequest.findById(req.params.productRequest)
      .populate('productsId.productId requestedId requesterId')
      .populate({ path: 'productsId.productId', populate: { path: 'companyProductId' } })
      .populate({ path: 'requestedId', populate: { path: 'countryId governorateId municipalityId' } })
      .populate({ path: 'requesterId', populate: { path: 'countryId governorateId municipalityId' } });
    updatedProductRequest.requesterValidation = true;
    await updatedProductRequest.save();
    const products = await Promise.all(updatedProductRequest.productsId.map(async (val, index) => ({
      index: index + 1,
      name: `${val.productId.label} (${val.productId.companyProductId.name})`,
      quantity: val.quantityValidated || val.quantityRequested,
      unitPrice: val.unitPriceRequested.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' }),
      total: ((val.unitPriceRequested) * (val.quantityValidated || val.quantityRequested)).toLocaleString('fr-TN', { style: 'currency', currency: 'TND' }),
      totalClone: ((val.unitPriceRequested) * (val.quantityValidated || val.quantityRequested)),
    })));
    const invoices = await ProductRequest.find({
      requestedId: updatedProductRequest.requestedId._id,
      requesterValidation: true,
    });
    const invoiceNumber = zeroPad(invoices.length, 8);

    await createInvoice(
      {
        invoiceRefCol: '123456789',
        dateNow: moment().format('MM-DD-YYYY'),
        supplier: {
          name: updatedProductRequest.requestedId.name,
          address: updatedProductRequest.requestedId.address,
          postalCode: updatedProductRequest.requestedId.postalCode,
          municipality: updatedProductRequest.requestedId.municipalityId.municipalityName,
          governorate: updatedProductRequest.requestedId.governorateId.governorateName,
          country: updatedProductRequest.requestedId.countryId.countryName,
          tvaNumber: '123456789',
          phone: updatedProductRequest.requestedId.phone,
          email: updatedProductRequest.requestedId.email,
          website: 'www.company.com',
        },
        user: {
          name: updatedProductRequest.requesterId.name,
          address: updatedProductRequest.requesterId.address,
          postalCode: updatedProductRequest.requesterId.postalCode,
          municipality: updatedProductRequest.requesterId.municipalityId.municipalityName,
          governorate: updatedProductRequest.requesterId.governorateId.governorateName,
          country: updatedProductRequest.requesterId.countryId.countryName,
          tvaNumber: '123456789',
          phone: updatedProductRequest.requesterId.phone,
          email: updatedProductRequest.requesterId.email,
          website: 'www.company.com',
        },
        invoiceNumber,
        logoRequesterId: path.join(__dirname, '..', '..', 'public', 'logo', '1677962138164--harth.png'),
        logoRequestedId: path.join(__dirname, '..', '..', 'template', 'logo.png'),
        products,
        totals: (products.reduce((a, b) => a + b.totalClone, 0)).toLocaleString('fr-TN', { style: 'currency', currency: 'TND' }),
      },
      path.join('src', 'template', 'product-request-invoice.html'),
      path.join('src', 'private', 'invoices', 'stock-request', req.params.productRequest, 'invoice.pdf'),
      `private/invoices/stock-request/${req.params.productRequest}`,
    );
    await pdfHeaderFooter(
      path.join('src', 'private', 'invoices', 'stock-request', req.params.productRequest, 'invoice.pdf'),
    );
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const requestedDone = async (req, res) => {
  try {
    const updatedProductRequest = await ProductRequest.findById(req.params.productRequest).populate('requestedId');
    updatedProductRequest.done = true;

    await updatedProductRequest.save();
    for await (const product of updatedProductRequest.productsId) {
      await ProductStock.findOneAndUpdate(
        { companyId: updatedProductRequest.requesterId, productId: product._id },
        {
          $addToSet: {
            quantityIn: {
              quantity: product.quantityValidated,
              date: moment().format(),
              unitPrice: product.unitPriceRequested,
              totalPrice: product.unitPriceRequested * Number(product.quantityValidated),
            },
          },
          $inc: {
            inStock: product.quantityValidated,
          },
        },
      );
      await ProductStock.findOneAndUpdate(
        { companyId: updatedProductRequest.requestedId, productId: product._id },
        {
          $addToSet: {
            quantityOut: {
              quantity: product.quantityValidated,
              date: moment().format(),
              unitPrice: product.unitPriceRequested,
              totalPrice: product.unitPriceRequested * Number(product.quantityValidated),
            },
          },
          $inc: {
            inStock: -Number(product.quantityValidated),
          },
        },
      );
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const downloadInvoice = async (req, res) => {
  try {
    const newFileName = `Invoice ${moment().format('DD-MM-YYYY')}.pdf`;
    const filePath = path.join('src', 'private', 'invoices', 'stock-request', req.query.id, 'invoice.pdf');

    return res.download(filePath, newFileName);
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  addProductRequest, downloadInvoice, validateUnitPrice, requestedDone, getAllProductRequest, updateQuantity, validateQuantity, requestedValidate, requesterValidate,
};
