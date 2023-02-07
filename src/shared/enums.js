const types = {
  super: 'super',
  external: 'external',
  internal: 'internal',
};
Object.freeze(types);
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
module.exports = {
  types, featureStatus, natures,
};
