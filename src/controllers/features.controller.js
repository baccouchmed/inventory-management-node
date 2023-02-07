const GroupFeature = require('../models/group-feature');
const { errorCatch } = require('../shared/utils');
const UserFeature = require('../models/user-feature');
const Feature = require('../models/feature');
const { featureStatus } = require('../shared/enums');

const addFeature = async (req, res) => {
  try {
    const {
      feature,
    } = req.body;
    const existCode = await Feature.findOne({
      code: feature.code,
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
    const newFeature = new Feature({
      code: feature.code,
      title: feature.title,
      status: feature.status,
      type: feature.type,
      usersCreation: req.user.id,
      divider: feature.divider,
    });
    if (feature.subtitle) {
      newFeature.subtitle = feature.subtitle;
    }
    if (feature.order) {
      newFeature.order = feature.order;
    }
    if (feature.featuresIdParent) {
      newFeature.featuresIdParent = feature.featuresIdParent;
    }
    if (feature.link) {
      newFeature.link = feature.link;
    }
    if (feature.icon) {
      newFeature.icon = feature.icon;
    }
    await newFeature.save();
    return res.status(201).json(newFeature);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getListParents = async (req, res) => {
  try {
    const Features = await Feature.find({ type: { $in: ['group', 'collapsable'] }, status: featureStatus.active }); return res.status(200).json(Features);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const groupFeaturesList = async (req, res) => {
  try {
    const Features = await Feature.find({ status: featureStatus.active });
    return res.status(200).json(Features);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getListFeatures = (req, res) => {
  res.json(res.paginatedFeatures);
};
const deleteFeature = async (req, res) => {
  try {
    const userFeatures = await UserFeature.find({ featuresId: req.params.id });
    const groupFeatures = await GroupFeature.find({ featuresId: req.params.id });
    if (userFeatures && userFeatures.length) {
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
    if (groupFeatures && groupFeatures.length) {
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
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) {
      return res.status(404).json({
        message: '404 not found',
      });
    }
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id).populate('featuresIdParent');
    if (!feature) {
      return res.status(404).json({
        message: '404 not found',
      });
    }

    return res.status(200).json(feature);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateFeature = async (req, res) => {
  try {
    const {
      feature,
    } = req.body;
    const { code } = feature;
    const existCode = await Feature.findOne({ _id: { $ne: feature._id }, code });
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
    const updatedFeature = await Feature.findByIdAndUpdate(feature._id, {
      code: feature.code,
      title: feature.title,
      status: feature.status,
      type: feature.type,
      usersUpdation: req.user.id,
      order: feature.order || null,
      subtitle: feature.subtitle || null,
      divider: feature.divider || null,
      link: feature.link || null,
      icon: feature.icon || null,
      featuresIdParent: feature.featuresIdParent,
    });

    await updatedFeature.save();

    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getSingleFeatureByLink = async (req, res) => {
  try {
    const defaultFeature = await Feature.aggregate([
      {
        $lookup: {
          from: 'features',
          localField: 'featuresIdParent',
          foreignField: '_id',
          as: 'featuresIdParent',
        },
      },
      { $unwind: { path: '$featuresIdParent', preserveNullAndEmptyArrays: true } },
      {
        $match: { link: req.body.link, status: featureStatus.active },
      },
    ]);
    let defaultFeaturesId = [];
    if (!defaultFeature || !defaultFeature.length) {
      defaultFeaturesId = await UserFeature.aggregate([
        {
          $lookup: {
            from: 'features',
            localField: 'featuresId',
            foreignField: '_id',
            as: 'featuresId',
          },
        },
        { $unwind: { path: '$featuresId', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            'featuresId.link': { $exists: true },
            'featuresId.status': featureStatus.active,
            status: true,
          },
        },
      ]);
      if (!defaultFeaturesId || !defaultFeaturesId.length) {
        defaultFeaturesId = await GroupFeature.aggregate([
          {
            $lookup: {
              from: 'features',
              localField: 'featuresId',
              foreignField: '_id',
              as: 'featuresId',
            },
          },
          { $unwind: { path: '$featuresId', preserveNullAndEmptyArrays: true } },
          {
            $match: {
              'featuresId.link': { $exists: true },
              'featuresId.status': featureStatus.active,
              status: true,
            },
          },
        ]);
      }
    }

    // eslint-disable-next-line no-nested-ternary
    return res.status(200).json((defaultFeature && defaultFeature.length) ? defaultFeature : ((defaultFeaturesId && defaultFeaturesId.length) ? defaultFeaturesId[0].featuresId : []));
  } catch (e) {
    return errorCatch(e, res);
  }
};
module.exports = {
  addFeature,
  getListParents,
  groupFeaturesList,
  getListFeatures,
  deleteFeature,
  getSingleFeature,
  updateFeature,
  getSingleFeatureByLink,
};
