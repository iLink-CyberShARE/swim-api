"use strict";

var AuthController = require("./swim-auth-api/controllers/authController");
var config = require("./config");

console.log('Creating Admin User...');
AuthController.createUsers(config.admin.user, config.admin.password);

console.log('Creating Guest User...');
AuthController.createUsers(config.guest.user, config.guest.password);

