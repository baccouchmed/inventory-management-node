const features = {
  // ***** group 1 ***** //
  setting: 'setting',
  companyProduct: 'company-product',
  typeProduct: 'type-product',
  products: 'products',
  store: 'store',
  stocks: 'stocks',
  countries: 'countries',
  newProducts: 'new-products',
  // ***** group 2 ***** //
  sgs: 'sgs',
  calendar: 'calendar',
  contracts: 'contracts',
  supplierClient: 'supplier-client',
  productRequest: 'product-request',
  myRequests: 'my-requests',
  otherRequests: 'other-requests',
  // ***** group 3 ***** //
  company: 'company',
  features: 'features',
  administration: 'administration',
  groups: 'groups',
  users: 'users',
  userFeatures: 'user-features',
  paramProject: 'param-project',
  // ***** group 4 ***** //
  account: 'account',
  profile: 'profile',
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
