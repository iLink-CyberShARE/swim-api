// constructor
const config = require("../../config");

// Mongo connection URL
const mongoURL =
  "mongodb://" +
  config.mongoDB.user +
  ":" +
  config.mongoDB.password +
  "@" +
  config.mongoDB.host +
  ":" +
  config.mongoDB.port +
  "/" +
  config.mongoDB.name +
  "?authSource=" +
  config.mongoDB.authsource;

module.exports = mongoURL;
