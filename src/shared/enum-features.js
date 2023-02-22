const features = {
  company: 'company',
  features: 'features',
  setting: 'setting',
  administration: 'administration',
  account: 'account',
  groups: 'groups',
  users: 'users',
  profile: 'profile',
  userFeatures: 'user-features',
  countries: 'countries',
  paramProject: 'param-project',
  product: 'product',
  companyProduct: 'company-product',
  typeProduct: 'type-product',
  store: 'store',
  stocks: 'stocks',
  contracts: 'contracts',
  productRequest: 'product-request',
  supplierClient: 'supplier-client',
};
Object.freeze(features);
const actions = {
  list: 'list',
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
};
Object.freeze(actions);
module.exports = {
  features, actions,
};
