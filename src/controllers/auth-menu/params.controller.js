const ParamProject = require('../../models/administration/paramProject');
const { errorCatch } = require('../../shared/utils');

const getParamsProject = async (req, res) => {
  try {
    const paramProject = await ParamProject.findOne({ companyId: req.user.companyId });
    if (!paramProject) {
      return res.status(404).json({
        message: '404 paramProject not found',
      });
    }

    return res.status(200).json(paramProject);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const getParamsProjectByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const paramProject = await ParamProject.findOne({ companyId });
    if (!paramProject) {
      return res.status(404).json({
        message: '404 paramProject not found',
      });
    }
    return res.status(200).json(paramProject);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const updateParamsProject = async (req, res) => {
  try {
    const {
      paramProject,
    } = req.body;
    const updatedParamProject = await ParamProject.findByIdAndUpdate(paramProject._id, {
      codeAttemptNumber: paramProject.codeAttemptNumber,
      codeExpirationTime: paramProject.codeExpirationTime,
      suspendPassword: paramProject.suspendPassword,
      suffixContactCode: paramProject.suffixContactCode,
      lengthContactCode: paramProject.lengthContactCode,
      confirmationCodeAttempt: paramProject.confirmationCodeAttempt,
      confirmationCodeDuration: paramProject.confirmationCodeDuration,
    });
    updatedParamProject.usersLastUpdate = req.user.id;
    await updatedParamProject.save();
    return res.status(204).end();
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  getParamsProject,
  getParamsProjectByCompany,
  updateParamsProject,
};
