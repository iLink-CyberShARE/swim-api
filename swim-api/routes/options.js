const express = require("express");
const { param, body, validationResult } = require("express-validator");
const config = require("../../config");
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const OptionCatalog = require("../models/option-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/options");

//instantiate option catalog model
option = new OptionCatalog();

/**
 * @swagger
 * /swim-api/options/model/{id}/type/{type}:
 *   get:
 *      description: Get model options by model identifier and option type.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *        - in: path
 *          name: type
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/options
 *      responses:
 *          '200':
 *              description: Options retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get(
  "/model/:id/type/:type",
  validateToken,
  param("id").not().isEmpty().trim().escape(),
  param("type").not().isEmpty().trim().escape(),
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

        option.GetByModelnType(
          db,
          req.params.id,
          req.params.type,
          function (result) {
            //close connection with database
            client.close();
            if (result !== null) message = "Options retrieved successfully";
            else {
              message = "No options found";
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
          }
        );
      }
    });
  }
);

/**
 * @swagger
 * /swim-api/options/insert:
 *  post:
 *    description: Creates new option document only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/options
 *    requestBody:
 *       description: Specification of options.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modelID:
 *                type: string
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              timestep:
 *                type: string
 *              parameter:
 *                type: string
 *    responses:
 *          '200':
 *              description: Option inserted successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.post(
  "/insert",
  validateToken,
  body("modelID").not().isEmpty().trim().escape(),
  body("name").not().isEmpty().trim().escape(),
  body("type").not().isEmpty().trim().escape(),
  body("timestep").not().isEmpty().trim().escape(),
  body("parameter").not().isEmpty().trim().escape(),
  (req, res, next) => {
    // validate if user has content manager access
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
      modelID: req.body.modelID,
      name: req.body.name,
      type: req.body.type,
      timestep: req.body.timestep,
      parameter: req.body.parameter,
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
        option.CreateOptionCatalog(db, document, function (result) {
          //close connection with database
          client.close();
          if (result !== null) message = "OK";
          else {
            message = "Error inserting option";
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
 * /swim-api/options/update/model/{modelID}/name/{name}:
 *  put:
 *    description: Updates option document only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/options
 *    parameters:
 *        - in: path
 *          name: modelID
 *          schema:
 *            type: string
 *          required: true
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *          required: true
 *    requestBody:
 *       description: Specification of option catalog.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              timestep:
 *                type: string
 *              parameter:
 *                type: string
 *    responses:
 *          '200':
 *              description: Option updated successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.put(
  "/update/model/:modelID/name/:name",
  validateToken,
  param("modelID").not().isEmpty().trim().escape(),
  param("name").not().isEmpty().trim().escape(),
  body("type").not().isEmpty().trim().escape(),
  body("timestep").not().isEmpty().trim().escape(),
  body("parameter").not().isEmpty().trim().escape(),
  (req, res, next) => {
    // input validation response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // validate if user has content manager access
    if (req.decoded.cont !== 1) {
      return res.status(401).json({
        error: "Access denied.",
      });
    }

    // Build the document only with the allowed fields
    var document = {
      modelID: req.params.modelID,
      name: req.params.name,
      type: req.body.type,
      timestep: req.body.timestep,
      parameter: req.body.parameter,
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
        option.updateOptionCatalog(
          db,
          req.params.modelID,
          req.params.name,
          document,
          function (result) {
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
          }
        );
      }
    });
  }
);

module.exports = router;
