const moment = require('moment');
const ProductRequest = require('../models/product-request');
const { errorCatch } = require('../shared/utils');
const { createInvoice } = require('../services/pdf-creator');

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
    const updatedProductRequest = await ProductRequest.findById(req.params.productRequest);
    updatedProductRequest.requesterValidation = true;

    await updatedProductRequest.save();
    await createInvoice(
      {},
      '',
      '',
      `private/invoices/stock-request/${req.params.productRequest}`,
    );
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  addProductRequest, getAllProductRequest, updateQuantity, validateQuantity, requestedValidate, requesterValidate,
};
