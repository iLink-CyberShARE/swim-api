const express = require("express");
const { param, body, check, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const ModelCatalog = require("../models/model-catalog");

const router = express.Router();
const validateToken = require("../../utils").validateToken;
router.get("/swim-api/model-catalog");

//instantiate model metadata model
model = new ModelCatalog();

/**
 * @swagger
 * /swim-api/model-catalog:
 *   get:
 *      description: Get all available model metadata.
 *      tags:
 *        - /swim-api/model-catalog
 *      responses:
 *          '200':
 *              description: Model metadata retrieved successfully.
 *          '500':
 *              description: Internal server error.
 *          '400':
 *              description: Bad request.
 */
router.get("", validateToken, (req, res, next) => {
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
      model.GetAll(db, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Models retrieved successfully";
        else{
          message = "No models found";
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

/**
 * @swagger
 * /swim-api/model-catalog/{id}:
 *   get:
 *      description: Gets model metadata by model unique identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *            required: true
 *      tags:
 *        - /swim-api/model-catalog
 *      responses:
 *          '200':
 *              description: Model metadata retrieved successfully
 *          '500':
 *              description: Internal server error
 *          '404':
 *              description: No models found
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

  client.connect(function(err) {
    if (err) {
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();
      model.GetByID(db, req.params.id, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Model retrieved successfully";
        else {
          message = "No models found";
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





/**
 * @swagger
 * /swim-api/model-catalog/insert:
 *  post:
 *    description: Creates new model catalog document in the model-catalog collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/model-catalog
 *    requestBody:
 *       description: Specification of hs-metadata.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              info:
 *                type: array
 *                items:
 *                  type: object
 *                  name:
 *                    type: string
 *                  description:
 *                    type: string
 *                  language: 
 *                    type: string
 *              dateCreated:
 *                type: string
 *              dateModified:
 *                type: string
 *              softwareAgent:
 *                type: string
 *              license:
 *                type: string
 *              version:
 *                type: string
 *              sponsor:
 *                type: string
 *              creators:
 *                type: array
 *                items:
 *                  type: object
 *                  name:
 *                    type:string
 *                  department:
 *                    type: string
 *                  email:
 *                    type: string
 *                  organization:
 *                    type: string
 *                  city:
 *                    type: string
 *                  state:
 *                    type: string
 *                  country:
 *                    type: string
 *              hostServer:
 *                type: object
 *                properties:
 *                  serverName:
 *                    type: string
 *                  serverAddress:
 *                    type: string
 *                  serverAdmin:
 *                    type: string
 *                  adminEmail:
 *                    type: string
 *                  serverOwner:
 *                    type: string
 *              serviceInfo:
 *                type: object
 *                properties: 
 *                  serviceUrl:
 *                    type: string
 *                  serviceMethod:
 *                    type: string
 *                  status:
 *                    type: string
 *                  consumes:
 *                    type: string
 *                  produces:
 *                    type: string
 *                  isPublic:
 *                    type: boolean
 *                  externalDocs:
 *                    type: array
 *                    items:
 *                      type: string 
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
  body("info").isArray().not().isEmpty().trim().escape(),
  body("*.name").not().isEmpty().trim().escape(),
  body("*.description").not().isEmpty().trim().escape(),
  body("*.language").not().isEmpty().trim().escape(),
  body("dateCreated").not().isEmpty().trim().escape(),
  body("dateModified").not().isEmpty().trim().escape(),
  body("softwareAgent").not().isEmpty().trim().escape(),
  body("license").not().isEmpty().trim().escape(),
  body("version").not().isEmpty().trim().escape(),
  body("sponsor").not().isEmpty().trim().escape(),
  body("creators").isArray().not().isEmpty().trim().escape(),
  body("*.name").not().isEmpty().trim().escape(),
  body("*.department").not().isEmpty().trim().escape(),
  body("*.organization").not().isEmpty().trim().escape(),
  body("*.city").not().isEmpty().trim().escape(),
  body("*.state").not().isEmpty().trim().escape(),
  body("*.country").not().isEmpty().trim().escape(),
  body("hostServer").isObject().not().isEmpty().trim().escape(),
  body("hostServer.serverName").not().isEmpty().trim().escape(),
  body("hostServer.serverAddress").not().isEmpty().trim().escape(),
  body("hostServer.adminEmail").not().isEmpty().trim().escape(), 
  body("hostServer.serverOwner").not().isEmpty().trim().escape(),
  body("serviceInfo").isObject().not().isEmpty().trim().escape(),
  body("serviceInfo.serviceURL").not().isEmpty(),
  body("serviceInfo.serviceMethod").not().isEmpty().trim().escape(),
  body("serviceInfo.status").not().isEmpty().trim().escape(),
  body("serviceInfo.consumes").not().isEmpty().trim().escape(),
  body("serviceInfo.produces").not().isEmpty().trim().escape(),
  body("serviceInfo.isPublic").not().isEmpty().trim().escape(),
  body("externalDocs").isArray().not().isEmpty().trim().escape(), 
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
        model.CreateModelCatlog(db, req.body, function (result) {
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


module.exports = router;
