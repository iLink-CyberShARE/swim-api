// npm dependencies

const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var morgan = require("morgan"),
  sequelize = require("sequelize"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  path = require("path");


// routes
const paramRoutes = require("./swim-api/routes/parameters");
const outRoutes = require("./swim-api/routes/outputs");
const modelRoutes = require("./swim-api/routes/models");
const acronymRoutes = require("./swim-api/routes/acronyms");
const themeRoutes = require("./swim-api/routes/themes");
const setRoutes = require("./swim-api/routes/sets");
const canRoutes = require("./swim-api/routes/cans");
const executionRoutes = require("./swim-api/routes/executions");
const summaryRoutes = require("./swim-api/routes/summaries");
const optionRoutes = require("./swim-api/routes/options");
const hsMetadataRoutes = require("./swim-api/routes/hs");
const authRoutes = require("./swim-auth-api/routes/api")(passport);
const loggerRoutes = require("./swim-logger-api/routes/api")(passport);

var hookJWTStrategy = require("./swim-auth-api/services/passportStrategy");

const app = express();

const swaggerOption = {
  swaggerDefinition: (swaggerJsdoc.Options = {
    openapi: '3.0.0',
    info: {
      title: "SWIM API",
      description: "Backend endpoint documentation for the Sustainable Water Through Integrated Modeling platform.",
      version: process.env.APPVERSION,
      termsOfService: "https://swim.cybershare.utep.edu/en/policy",
      license: {
        name: "Creative Commons Attribution-NonCommercial 4.0 International License",
        url: "https://creativecommons.org/licenses/by-nc/4.0/",
      },
      contact: {
        name: "SWIM Team",
        email: "swim@utep.edu"
      }
    },
    servers: [
      {
        "url": process.env.APPURL, // "url": "http://localhost:3000",  // https://services.cybershare.utep.edu/swim-api
        "description": process.env.SERVERDESCRIPTION    // "description": "Local Server (Development)"
      }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  }),
  apis: ["swim-api/routes/*.js" , "swim-auth-api/routes/*.js", "swim-logger-api/routes/*.js"],
};

const uiOpts = {
  customSiteTitle: "SWIM API"
};

const swaggerDocs = swaggerJsdoc(swaggerOption);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, uiOpts));

//data format parser from the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 5: Hook up the HTTP logger.
app.use(morgan("dev"));
// Hook the passport JWT strategy.
hookJWTStrategy(passport);

//add CORS and allowed headers
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

//swim-api routes
app.use("/swim-api/parameters", paramRoutes);
app.use("/swim-api/outputs", outRoutes);
app.use("/swim-api/model-catalog", modelRoutes);
app.use("/swim-api/acronyms", acronymRoutes);
app.use("/swim-api/themes", themeRoutes);
app.use("/swim-api/sets", setRoutes);
app.use("/swim-api/cans", canRoutes);
app.use("/swim-api/hs", hsMetadataRoutes);
app.use("/swim-api/executions", executionRoutes);
app.use("/swim-api/summaries", summaryRoutes);
app.use("/swim-api/options", optionRoutes);
// // swim-auth API routes.
app.use("/swim-auth-api", authRoutes);
// logger API routes
app.use("/swim-logger-api", loggerRoutes);

module.exports = app;
