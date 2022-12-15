const express = require("express");
const { param, body, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const CustomScenarioCatalog = require("../models/custom-scenario-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/executions");

// instantiate custom scenario catalog model
customScenarios = new CustomScenarioCatalog();

/**
 * @swagger
 * /swim-api/executions/public:
 *   get:
 *      description: Get all public model execution metadata.
 *      tags:
 *        - /swim-api/executions
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Public scenarios retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/public", validateToken, (req, res, next) => {
  var message = "";
  console.log(mongoURL);
  const client = new MongoClient(mongoURL);

  client.connect(function (err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      const db = client.db();
      customScenarios.GetPublicMetadata(db, function (result) {
        client.close();
        if (result.length > 0) {
          message = "Model execution metadata retrieved sucessfully";
          // convert start and end to date times
        } else {
          message = "No public model executions found";
          // success response
          return res.status(404).json({
            error: message,
          });
        }
        // error response
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
 * /swim-api/executions/public-runs/{id}:
 *   get:
 *      description: Get public user scenario by unique identifier. Includes data and metadata.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/executions
 *      responses:
 *          '200':
 *              description: Output metadata retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/public-runs/:id", validateToken, 
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
      const db = client.db();
      console.log(req.params.id);
      customScenarios.GetPublicScenarioByID(db, req.params.id, function (
        result
      ) {
        client.close();
        if (result !== null) message = "Scenario run retrieved successfully";
        else {
          message = "No public model executions found";
          // success response
          return res.status(404).json({
            error: message,
          });
        }
        // error response
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
 * Get public or private runs by id.
 * Searches public collection first, if not found searches private collection.
 * TODO: add extra protection layer to the query of the private scenario.
 */

/**
 * @swagger
 * /swim-api/executions/runs/{id}:
 *   get:
 *      description: Get public or private runs by unique identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/executions
 *      responses:
 *          '200':
 *              description: User scenario retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/runs/:id", validateToken, 
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
      const db = client.db();
      customScenarios.GetPublicScenarioByID(db, req.params.id, function (
        result
      ) {
        if (result !== null) {
          message = "Scenario run retrieved successfully";
          client.close();
          return res.status(200).json({
            "@context": config.context,
            message: message,
            result: result,
          });
        } else {
          customScenarios.GetPrivateScenarioByID(db, req.params.id, function (
            result
          ) {
            if (result !== null) {
              message = "Scenario run retrieved successfully";
              client.close();
              return res.status(200).json({
                "@context": config.context,
                message: message,
                result: result,
              });
            } else {
              client.close();
              return res.status(404).json({
                error: message,
              });
            }
          });
        }
      });
    }
  });
});

/**
 * @swagger
 * /swim-api/executions/public-meta/bymodel/{id}:
 *   get:
 *      description: Get listing of public scenarios by model identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/executions
 *      responses:
 *          '200':
 *              description: Public scenarios retrieved successfully.
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/public-meta/bymodel/:id", validateToken, 
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
      const db = client.db();
      customScenarios.GetPublicScenarioByModel(db, req.params.id, function (
        result
      ) {
        client.close();
        if (result.length > 0) message = "Scenario runs retrieved successfully";
        else {
          message = "No public model executions found from specified model";
          // success response
          return res.status(404).json({
            error: message,
          });
        }
        // error response
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
 * /swim-api/executions/private-meta/bymodel/{id}:
 *   get:
 *      description: Get listing of private user scenarios by model identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/executions
 *      responses:
 *          '200':
 *              description: Private scenarios retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/private-meta/bymodel/:id", validateToken, 
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
      const db = client.db();
      customScenarios.GetPrivateScenarioByModel(
        db,
        req.params.id,
        req.decoded.id,
        function (result) {
          client.close();
          if (result.length > 0) message = "Scenario runs retrieved successfully";
          else {
            message = "No scenarios found";
            // success response
            return res.status(404).json({
              message: message,
            });
          }
          // error response
          return res.status(200).json({
            "@context": config.context,
            message: message,
            result: result,
          });
        }
      );
    }
  });
});

/**
 * @swagger
 * /swim-api/executions/cross-scenarios:
 *  post:
 *    description: Get public user scenarios and filtered outputs.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/crosscompare
 *    requestBody:
 *       description: scenario ids and unique output names
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              scenarioids:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["a25d5b72-10a6-4dac-89c4-a41bb699ee12"]
 *              outputnames:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["aquifer_depth"]
 *    responses:
 *          '200':
 *              description: Cross scenarios retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '404':
 *              description: No scenarios found
 *          '400':
 *              description: Bad request
 */
router.post("/cross-scenarios", validateToken, 
  body('scenarioids').not().isEmpty().isArray(1),
  body('outputnames').not().isEmpty().isArray(1),
  (req, res, next) => {

  // input validation response
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
      const db = client.db();
      customScenarios.GetFilteredScenarioOutputs(
        db,
        req.body.scenarioids,
        req.body.outputnames,
        function (result) {
          client.close();
          if (result !== null)
            message = "Cross scenarios retrieved successfully";
          else {
            message = "Cross scenarios not found";
            // success response
            return res.status(404).json({
              error: message,
            });
          }
          // error response
          return res.status(200).json({
            "@context": config.context,
            message: message,
            result: result,
          });
        }
      );
    }
  });
});

/**
 * @swagger
 * /swim-api/executions/private-cross-scenarios:
 *  post:
 *    description: Get private user scenarios and filtered outputs.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/crosscompare
 *    requestBody:
 *       description: scenario ids and unique output names
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              scenarioids:
 *                type: array
 *                items:
 *                  type: string
 *              outputnames:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *          '200':
 *              description: Cross scenarios retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '404':
 *              description: No scenarios found
 *          '400':
 *              description: Bad request
 */
router.post("/private-cross-scenarios", validateToken, 
  body('scenarioids').not().isEmpty().isArray(1),
  body('outputnames').not().isEmpty().isArray(1),
  (req, res, next) => {

  // input validation response
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
      const db = client.db();
      customScenarios.GetPrivateFilteredScenarioOutputs(
        db,
        req.decoded.id,
        req.body.scenarioids,
        req.body.outputnames,
        function (result) {
          client.close();
          if (result !== null)
            message = "Cross scenarios retrieved successfully";
          else {
            message = "Cross scenarios not found";
            // success response
            return res.status(404).json({
              error: message,
            });
          }
          // error response
          return res.status(200).json({
            "@context": config.context,
            message: message,
            result: result,
          });
        }
      );
    }
  });
});

/**
 * @swagger
 * /swim-api/executions/private:
 *   get:
 *      description: Get listing of model runs by the logged in user.
 *      tags:
 *        - /swim-api/executions
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Private scenarios retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
router.get("/private", validateToken, (req, res, next) => {
  var message = "";
  const client = new MongoClient(mongoURL);

  client.connect(function (err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      const db = client.db();
      customScenarios.GetUserPrivateScenarios(db, req.decoded.id, function (
        result
      ) {
        client.close();
        if (result.length > 0) {
          message = "Model execution metadata retrieved sucessfully";
          // convert start and end to date times
        } else {
          message = "No private model executions found";
          // success response
          return res.status(404).json({
            error: message,
          });
        }
        // error response
        return res.status(200).json({
          "@context": config.context,
          message: message,
          result: result,
        });
      });
    }
  });
});

// TODO: changed to delete method (update frontend)
/**
 * @swagger
 * /swim-api/executions/delete/{id}:
 *   delete:
 *      description: Delete private scenario by identifier from current logged in user.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/executions
 *      responses:
 *          '200':
 *              description: Private scenario deleted successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
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

  client.connect(function (err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error",
      });
    } else {
      const db = client.db();
      customScenarios.DeleteUserPrivateScenario(
        db,
        req.params.id,
        req.decoded.id,
        function (result) {
          client.close();
          if (result == null) {
            message = "Error deleting scenario";
          } else {
            message = "Scenario deleted successfully";
            // success response
            return res.status(200).json({
              message: message,
              result: result.ok,
            });
          }
          // error response
          return res.status(404).json({
            error: message,
          });
        }
      );
    }
  });
});

module.exports = router;
