const types = {
  super: 'super',
  external: 'external',
  internal: 'internal',
};
Object.freeze(types);
const typesCompany = {
  store: 'store',
  supplier: 'supplier',
  factory: 'factory',
};
Object.freeze(typesCompany);
const featureStatus = {
  active: 'active',
  notActive: 'notActive',
};
Object.freeze(featureStatus);
const natures = {
  moral: 'moral',
  physical: 'physical',
};
Object.freeze(natures);
const StatusContract = {
  pending: 'pending',
  validate: 'validate',
  rejected: 'rejected',
  opened: 'opened',
};
Object.freeze(StatusContract);
const CreateStatusEnum = {
  pending: 'pending',
  validated: 'validated',
  rejected: 'rejected',
};
Object.freeze(CreateStatusEnum);
module.exports = {
  types, featureStatus, natures, typesCompany, StatusContract, CreateStatusEnum,
};
