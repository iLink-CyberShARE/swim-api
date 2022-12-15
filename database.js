const Sequelize = require('sequelize');
const config = require('./config');

const db = {};

/* Logger Database */
db1 = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  config.db.details
);

/* User Database */
db2 = new Sequelize(
  config.db2.name,
  config.db2.user,
  config.db2.password,
  config.db2.details
);

db['log'] = db1;
db['auth'] = db2;

//Create connection to sql
module.exports = db;

