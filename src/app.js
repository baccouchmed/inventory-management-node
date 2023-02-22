const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');

const app = express();

const server = http.createServer(app);

const setupMongoServer = require('./middlewares/database');
const migrationScript = require('./middlewares/migration');

// PORT
const port = process.env.PORT || 8080;
// Connecting mongoDB
setupMongoServer();
migrationScript();

// Set up email cron
const authenticationRoute = require('./routes/auth-menu/authentication.route');
const usersRoute = require('./routes/administration/users.route');
const companiesRoute = require('./routes/administration/companies.route');
const companiesProductsRoute = require('./routes/setting/companies-products.route');
const menusRoute = require('./routes/auth-menu/menu.route');
const featuresRoute = require('./routes/setting/features.route');
const groupsRoute = require('./routes/administration/groups.route');
const paramProjectRoute = require('./routes/administration/param-project.route');
const inventoryRoute = require('./routes/sgs/inventory.route');
const countriesRoute = require('./routes/setting/countries.route');
const contractsRoute = require('./routes/sgs/contracts.route');
const productRequestRoute = require('./routes/sgs/product-request.route');
const badgesRoute = require('./routes/auth-menu/badges.route');

app.use(morgan('combined'));
// Setting up static directory
app.use('/api/public', express.static(path.join(__dirname, 'public')));
app.use('/api/private', express.static(path.join(__dirname, 'private')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// RESTful API root
app.use('/api/authentication', authenticationRoute);
app.use('/api/users', usersRoute);
app.use('/api/companies', companiesRoute);
app.use('/api/companiesproducts', companiesProductsRoute);
app.use('/api/menus', menusRoute);
app.use('/api/features', featuresRoute);
app.use('/api/groups', groupsRoute);
app.use('/api/paramProject', paramProjectRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/countries', countriesRoute);
app.use('/api/contracts', contractsRoute);
app.use('/api/product-request', productRequestRoute);
app.use('/api/badges', badgesRoute);

// app.use('/api/companies', companiesRoute);
// Index Route
app.get('/', (req, res) => {
  res.status(404).send({ message: '404 not found' });
});
app.get('*', (req, res) => {
  res.status(404).json({ message: '404 not found' });
});
app.use((req, res) => {
  res.status(404).json({ message: '404 not found' });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Connected to port ${port}`);
});
