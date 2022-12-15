const express = require("express");
const { param, body, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const OutputCatalog = require("../models/output-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/outputs");

//instantiate output catalog model
output = new OutputCatalog();

/**
 * @swagger
 * /swim-api/outputs:
 *   get:
 *      description: Get metadata of all available outputs.
 *      tags:
 *        - /swim-api/outputs
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Outputs retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No outputs found
 *          '500':
 *              description: Internal server error
 */
 router.get("", validateToken, (req, res, next) => {
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

      output.GetAll(db, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Outputs retrieved successfully";
        else {
          message = "No outputs found";
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
 * /swim-api/outputs/model/{id}:
 *   get:
 *      description: Get output metadata linked to model identifier.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/outputs
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
router.get("/model/:id", validateToken,
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
      output.GetByModel(db, req.params.id, function(result) {
        // close connection with database
        client.close();
        // console.log(result.length);
        if (result.length > 0) message = "Outputs retrieved successfully";
        else {
          message = "No outputs found";
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
 * /swim-api/outputs/name/{name}:
 *   get:
 *      description: Get model output metadata by unique name.
 *      tags:
 *        - /swim-api/outputs
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
 *              description: Output metadata retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: Output not found
 *          '500':
 *              description: Internal server error
 */
 router.get("/name/:name",validateToken, 
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
      // console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();
      output.GetByName(db, req.params.name, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Outputs retrieved successfully";
        else {
          message = "No outputs found";
          // error response
          return res.status(404).json({
            error: message
          });
        }
        //success response
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
 * /swim-api/outputs/insert:
 *  post:
 *    description: Creates new output catalog document in the output catalog collection.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/outputs
 *    requestBody:
 *       description: Specification of output catalog.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modelID:
 *                type: string
 *              varName:
 *                type: string
 *              varinfo:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    varLabel:
 *                      type: string
 *                    varCategory:
 *                      type: string
 *                    lang:
 *                      type: string
 *                    varDescription:
 *                      type: string
 *                    varUnit:
 *                      type: string
 *                          
 *    responses:
 *          '200':
 *              description: hs-metadata added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
 router.post("/insert", validateToken, 
    body("modelID").not().isEmpty().trim().escape(),
    body("varName").not().isEmpty().trim().escape(),
    body("varinfo").isArray(1).not().isEmpty(),
    body("varinfo.*.varLabel").not().isEmpty().trim().escape(),
    body("varinfo.*.varCategory").not().isEmpty().trim().escape(),
    body("varinfo.*.lang").not().isEmpty().trim().escape(),
    body("varinfo.*.varDescription").not().isEmpty().trim().escape(),
    body("varinfo.*.varUnit").not().isEmpty().trim().escape(),
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
        output.CreateOutputCatalog(db, req.body, function (result) {
          //close connection with database
          client.close();
          if (result !== null) message = "OK";
          else {
            message = "Error inserting outputcatalog";
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
 * /swim-api/outputs/update/{modelID}:
 *  put:
 *    description: Inserts output catalog into the outputs collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/outputs
 *    parameters:
 *        - in: path
 *          name: modelID
 *          schema:
 *            type: string
 *            required: true 
 *    requestBody:
 *       description: Specification of output catalog.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              varName:
 *                type: string
 *              varinfo:
 *                type: array
 *                items:
 *                 type: object
 *                 properties:
 *                  varLabel:
 *                    type: string
 *                  varCategory:
 *                    type: string
 *                  lang:
 *                    type: string
 *                  varDescription:
 *                    type: string
 *                  varUnit:
 *                    type: string
 *    responses:
 *          '200':
 *              description: hs-metadata added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
 router.put(
  "/update/:modelID",
  validateToken,
  param("modelID").not().isEmpty().trim().escape(),
  body("varName").not().isEmpty().trim().escape(),
  body("varinfo").isArray(1).not().isEmpty().trim().escape(),
  body("varinfo.*").not().isEmpty().isJSON(1),
  body("varinfo.*.varLabel").not().isEmpty().trim().escape(),
  body("varinfo.*.varCategory").not().isEmpty().trim().escape(),
  body("varinfo.*.lang").not().isEmpty().trim().escape(),
  body("varinfo.*.varDescription").not().isEmpty().trim().escape(),
  body("varinfo.*.varUnit").not().isEmpty().trim().escape(),
  
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
      'varLabel': req.body.varLabel,
      'varCategory': req.body.varCategory,
      'lang': req.body.lang,
      'varDescription': req.body.varDescription,
      'varUnit': req.body.varUnit,
    };

    var message = "";
    const client = new MongoClient(mongoURL);

    client.connect(function (err) {
      if (err) {
        return res.status(500).json({
          message: "Database connection error",
        });    
      } 
      
      else {
        const db = client.db();
        // insert function here
        output.UpdateOutputCatalog(db, req.params.modelID, req.body.varName, document, function (result) {
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
