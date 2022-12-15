const express = require("express");
const { param, body, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const CannedScenarios = require("../models/canned-scenarios");
const mysqldb = require("../../database");
const User = require("../../swim-auth-api/models/user");

const router = express.Router();
const validateToken = require("../../utils").validateToken;
router.get("/swim-api/cans");

//instantiate model metadata model
can = new CannedScenarios();

/**
 * @swagger
 * /swim-api/cans:
 *   get:
 *      description: Get title and description from all canned scenarios.
 *      tags:
 *        - /swim-api/cans
 *      responses:
 *          '200':
 *              description: Scenarios retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get("", validateToken, (req, res, next) => {
  var message = "";
  
  const client = new MongoClient(mongoURL);
  client.connect(function (err) {
    if (err) {
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      const db = client.db();
      can.GetAll(db, function (result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Scenarios retrieved successfully";
        else {
          message = "No canned scenarios found";
          return res.status(404).json({
            error: message,
          });
        }
        //json response
        return res.status(200).json({
          "@context": config.context,
          message: message,
          result: result,
        });
      });
    }
  });
});

/**
 * @swagger
 * /swim-api/cans/{id}:
 *   get:
 *      description: Get canned scenario by unique identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/cans
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get("/:id", validateToken, 
  param('id').not().isEmpty().trim().escape(),
  (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }    

  var message = "";
  const client = new MongoClient(mongoURL);

  client.connect(function (err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();
      can.GetByID(db, req.params.id, function (result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Scenario retrieved successfully";
        else {
          message = "No scenarios found";
          return res.status(404).json({
            error: message,
          });
        }
        //json response
        return res.status(200).json({
          "@context": config.context,
          message: message,
          result: result,
        });
      });
    }
  });
});


// TODO: Test this endpoint on a dev database
/**
 * @swagger
 * /swim-api/cans/insert:
 *  post:
 *    description: Inserts a canned scenario specification into the canned scenarios collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/cans
 *    requestBody:
 *       description: Specification of a canned scenario.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              modelID:
 *                type: string
 *              hideTools:
 *                type: boolean
 *              scenarioID: 
 *                type: string 
 *              outputFilter:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *          '200':
 *              description: Canned scenario added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.post("/insert", validateToken, 
  body('_id').not().isEmpty().trim().escape(),
  body('name').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  body('modelID').not().isEmpty().trim().escape(),
  body('hideTools').isBoolean(),
  body('scenarioID').not().isEmpty().trim().escape(),
  body('outputFilter').not().isEmpty().isArray(1),
  (req, res, next) => {

  // validate that the user has access to insert canned scenarios
  if (req.decoded.cont !== 1) {
    return res.status(401).json({
      error: "Access denied.",
    });
  }

  // input validation response
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var message = "";
  const client = new MongoClient(mongoURL);
  client.connect(function (err) {
    if (err) {
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      const db = client.db();
      // insert function here
      can.CreateCan(db, req.body, function (result) {
        //close connection with database
        client.close();
        if (result !== null) message = "OK";
        else {
          message = "Error inserting canned scenario";
          return res.status(500).json({
            error: message,
          });
        }
        //json response
        return res.status(200).json({
          message: message,
          result: result,
        });
      });
    }
  });
});

/**
 * @swagger
 * /swim-api/cans/delete/{id}:
 *   delete:
 *      description: Deletes a canned scenario specfication by unique identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/cans
 *      responses:
 *          '200':
 *              description: Canned scenario deleted successfully
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: Access Denied
 *          '500':
 *              description: Internal server error
 */
router.delete("/delete/:id", validateToken, 
  param('id').not().isEmpty().trim().escape(), 
  (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }    

  var message = "";
  const client = new MongoClient(mongoURL);

  // validate user access
  var findQuery = { where: { uid: req.decoded.id } };
  User.findOne(findQuery).then(async function (user) {
    if (!user || user.dataValues.is_contentmanager !== 1) {
      message = "access denied";
      return res.status(401).json({
        error: message,
      });
    } else {
      // perform connection to mongo and delete the canned scenario
      client.connect(function (err) {
        if (err) {
          return res.status(500).json({
            message: "Database connection error",
          });
        } else {
          const db = client.db();
          // insert function here
          can.DeleteCan(db, req.params.id, function (result) {
            //close connection with database
            client.close();
            if (result.deletedCount === 1) message = "OK";
            else {
              message = "Error deleting canned scenario";
              return res.status(500).json({
                error: message,
              });
            }
            //json response
            return res.status(200).json({
              message: message,
              result: result,
            });
          });
        }
      });
    }
  });
});

module.exports = router;
