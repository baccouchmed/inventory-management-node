const features = {
  company: 'company',
  features: 'features',
  setting: 'setting',
  administration: 'administration',
  account: 'account',
  groups: 'groups',
  thirdPartyType: 'third-party-type',
  thirdParty: 'third-party',
  users: 'users',
  profile: 'profile',
  currencies: 'currencies',
  userFeatures: 'user-features',
  countries: 'countries',
  paramProject: 'param-project',
  customer: 'customer',
  supplier: 'supplier',
  category: 'category',
  subcategory: 'subcategory',
  product: 'product',
  companyProduct: 'company-product',
  typeProduct: 'type-product',
  inventory: 'inventory',
  stocks: 'stocks',
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
