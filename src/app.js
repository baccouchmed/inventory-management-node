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
const authenticationRoute = require('./routes/authentication.route');
const usersRoute = require('./routes/users.route');
const companiesRoute = require('./routes/companies.route');
const companiesProductsRoute = require('./routes/companies-products.route');
const menusRoute = require('./routes/menu.route');
const featuresRoute = require('./routes/features.route');
const groupsRoute = require('./routes/groups.route');
const paramProjectRoute = require('./routes/param-project.route');
const thirdpartyRoute = require('./routes/third-party.route');
const typethirdpartyRoute = require('./routes/type-third-party.route');
const inventoryRoute = require('./routes/inventory.route');
// const companiesRoute = require('./routes/companies.route');

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
app.use('/api/thirdparty', thirdpartyRoute);
app.use('/api/typethirdparty', typethirdpartyRoute);
app.use('/api/inventory', inventoryRoute);

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
