// app/services/database.js

'use strict';

var config = require('../config'),
    Sequelize = require('sequelize');
//Create connection to sql
module.exports = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    config.db.details
);