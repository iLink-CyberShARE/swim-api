const express = require("express");
const { param, body, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const ParameterCatalog = require("../models/parameter-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/parameters");

//instantiate parameter catalog model
parameter = new ParameterCatalog();

/**
 * @swagger
 * /swim-api/parameters:
 *   get:
 *      description: Get all available parameters. The amount of data generated from this endpoint may cause swagger docs to freeze.
 *      tags:
 *        - /swim-api/parameters
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Parameters retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No parameters found
 *          '500':
 *              description: Internal server error
 */
router.get("", validateToken,(req, res, next) => {
  var message = "";
  const client = new MongoClient(mongoURL);

  client.connect(function(err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();

      parameter.GetAll(db, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Parameters retrieved successfully";
        else {
          message = "No parameters found";
          // error response
          return res.status(404).json({
            error: message
          });
        }
        // success response
        return res.status(200).json({
          "@context": config.context,
          message: message,
          result: result
        });
      });
    }
  });
});

/**
 * @swagger
 * /swim-api/parameters/model/{id}:
 *   get:
 *      description: Get parameters linked to model identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/parameters
 *      responses:
 *          '200':
 *              description: Parameter retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/model/:id",validateToken, 
  param('id').not().isEmpty().trim().escape(),
  (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  var message= "";
  const client = new MongoClient(mongoURL);

  client.connect(function(err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();

      parameter.GetByModel(db, req.params.id, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Parameters retrieved successfully";
        else {
          message = "No parameters found";
          // error response
          return res.status(404).json({
            error: message
          });
        }
        // success response
        return res.status(200).json({
          "@context": config.context,
          message: "Parameters retrieved sucessfully",
          result: result
        });
      });
    }
  });
});

/**
 * @swagger
 * /swim-api/parameters/name/{name}:
 *   get:
 *      description: Get model parameter by unique name.
 *      tags:
 *        - /swim-api/parameters
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Parameter metadata retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: Parameter not found
 *          '500':
 *              description: Internal server error
 */
 router.get("/name/:name", validateToken, 
  param('name').not().isEmpty().trim().escape(),
  (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }   

  var message = "";
  const client = new MongoClient(mongoURL);

  client.connect(function(err) {
    if (err) {
      //console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      //console.log("Connected to Mongo!");
      const db = client.db();

      parameter.GetByName(db, req.params.name, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Parameters retrieved successfully";
        else {
          message = "No parameters found";
          return res.status(404).json({
            error: message
          });
        }
        //json response
        return res.status(200).json({
          "@context": config.context,
          message: message,
          result: result
        });
      });
    }
  });
});

module.exports = router;
