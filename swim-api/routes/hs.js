const express = require("express");
const { param, body, validationResult } = require("express-validator");
const config = require("../../config");
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const hsMetadata = require("../models/hs-metadata");
const mysqldb = require("../../database");
const User = require("../../swim-auth-api/models/user");
const { ResultWithContext } = require("express-validator/src/chain");

const router = express.Router();
const validateToken = require("../../utils").validateToken;
router.get("/swim-api/hs");

//instantiate model hs-metadata model
hsm = new hsMetadata();

/**
 * @swagger
 * /swim-api/hs/by_scenario/{scenario_id}:
 *   get:
 *      description: Get hs-metadata by its scene id.
 *      parameters:
 *        - in: path
 *          name: scenario_id
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/hs
 *      responses:
 *          '200':
 *              description: Scenarios retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get(
  "/by_scenario/:scenario_id",
  validateToken,
  param("scenario_id").not().isEmpty().trim().escape(),
  (req, res, next) => {
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
        hsm.GetByScenarioID(db, req.params.scenario_id, function (result) {
          //close connection with database
          client.close();
          if (result.length > 0) message = "HS metadata retrieved successfully";
          else {
            message = "No HS metadata found";
            return res.status(404).json({
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
);

/**
 * @swagger
 * /swim-api/hs/by_hs/{hs_id}:
 *   get:
 *      description: Get hs-metadata by its HS identifier.
 *      parameters:
 *        - in: path
 *          name: hs_id
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/hs
 *      responses:
 *          '200':
 *              description: HS metadata found successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

router.get(
  "/by_hs/:hs_id",
  validateToken,
  param("hs_id").not().isEmpty().trim().escape(),
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

        hsm.GetByHsID(db, req.params.hs_id, function (result) {
          //close connection with database
          client.close();
          if (result.length > 0) message = "Metadata retrieved successfully";
          else {
            message = "No parameters found";
            // error response
            return res.status(404).json({
              error: message,
            });
          }
          // success response
          return res.status(200).json({
            message: "Metadata retrieved sucessfully",
            result: result,
          });
        });
      }
    });
  }
);

/**
 * @swagger
 * /swim-api/hs/update/{scenario_id}:
 *  put:
 *    description: Inserts hs-metadata into the hs-metadata collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/hs
 *    parameters:
 *        - in: path
 *          name: scenario_id
 *          schema:
 *            type: string
 *          required: true 
 *    requestBody:
 *       description: Specification of hs-metadata.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              hs_id:
 *                type: string
 *              hs_url:
 *                type: string
 *              hs_type:
 *                type: string
 *    responses:
 *          '200':
 *              description: hs-metadata added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.put(
  "/update/:scenario_id",
  validateToken,
  param("scenario_id").not().isEmpty().trim().escape(),
  body("hs_id").not().isEmpty().trim().escape(),
  body("hs_url").not().isEmpty().trim(), // careful here will handle this later...
  body("hs_type").not().isEmpty().trim().escape(),
  (req, res, next) => {

    // input validation response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    // TODO: Extract user id from token and insert as another json field
  
    // TODO: Validate that the scenario exists and is owned by the user making the request
    
    // Build the document only with the allowed fields
    var document = {
      scenario_id: req.params.scenario_id,
      hs_id: req.body.hs_id,
      hs_url: req.body.hs_url,
      hs_type: req.body.hs_type,
      user_id: req.decoded.id,
    };

    var message = "";
    const client = new MongoClient(mongoURL);

    var findQuery = { where: { uid: req.decoded.id } };

    User.findOne(findQuery).then(async function (user) {

      if (!user || user.dataValues.is_contentmanager !== 1) {
        message = "access denied";
        return res.status(401).json({
          error: message,
        });
      }

      else {
        client.connect(function (err) {
          if (err) {
            return res.status(500).json({
              message: "Database connection error",
            });    
          } 
          
          else {
            const db = client.db();
            // insert function here
            hsm.updateMetatData(db, req.params.scenario_id, req.decoded.id, document, function (result) {
            //close connection with database
              client.close();
            
              if (result !== null) message = "OK";
            
              else {
                message = "Error inserting hs-metadata";
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
  }
);





/**
 * @swagger
 * /swim-api/hs/insert:
 *  post:
 *    description: Creates new hs-metadata document in the hs-metadata collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/hs
 *    requestBody:
 *       description: Specification of hs-metadata.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              scenario_id:
 *                type: string
 *              hs_id:
 *                type: string
 *              hs_url:
 *                type: string
 *              hs_type:
 *                type: string
 *    responses:
 *          '200':
 *              description: hs-metadata added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
 router.post(
  "/insert",
  validateToken,
  body("scenario_id").not().isEmpty().trim().escape(),
  body("hs_id").not().isEmpty().trim().escape(),
  body("hs_url").not().isEmpty().trim(), // careful here will handle this later...
  body("hs_type").not().isEmpty().trim().escape(),
  (req, res, next) => {

    //validate if user has access to alter hw-metadata
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
    
    // Build the document only with the allowed fields
    var document = {
      scenario_id: req.body.scenario_id,
      hs_id: req.body.hs_id,
      hs_url: req.body.hs_url,
      hs_type: req.body.hs_type,
      user_id: req.decoded.id,
    };

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
        hsm.CreateMetaData(db, document, function (result) {
          //close connection with database
          client.close();
          if (result !== null) message = "OK";
          else {
            message = "Error inserting hs-metadata";
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
);


/**
 * @swagger
 * /swim-api/hs/delete/{scenario_id}:
 *   delete:
 *      description: Deletes a hs-metadata specfication by unique identifier.
 *      parameters:
 *        - in: path
 *          name: scenario_id
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/hs
 *      responses:
 *          '200':
 *              description: hs-metadata deleted successfully
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: Access Denied
 *          '500':
 *              description: Internal server error
 */
 router.delete(
  "/delete/:scenario_id",
  validateToken,
  param("scenario_id").not().isEmpty().trim().escape(),
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
        // perform connection to mongo and delete hs-metadata
        client.connect(function (err) {
          if (err) {
            return res.status(500).json({
              message: "Database connection error",
            });
          } else {
            const db = client.db();
            // insert function here
            hsm.DeleteMetadata(db, req.decoded.id, req.params.scenario_id, function (result) {
              //close connection with database
              client.close();
              if (result.deletedCount === 1) message = "OK";
              else {
                message = "Error deleting metadata";
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
  }
);




module.exports = router;
