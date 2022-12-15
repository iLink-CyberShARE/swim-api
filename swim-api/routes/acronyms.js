const express = require("express");
const { param, body, validationResult, check } = require('express-validator');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const AcronymCatalog = require("../models/acronym-catalog");
const config = require("../../config");

const router = express.Router();
const validateToken = require("../../utils").validateToken;
router.get("/swim-api/acronyms");

//instantiate acronym catalog model
acronym = new AcronymCatalog();

//get outputs by model and language

/**
 * @swagger
 * /swim-api/acronyms/model/{id}/lang/{lan}:
 *   get:
 *      description: Get text acronyms by model and language.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          default: 5d8cdb841328534298eacf4a
 *          description: String model ID
 *        - in: path
 *          name: lan
 *          schema:
 *            type: string
 *          default: en-us
 *          required: true
 *          description: String acronym of model language (en-us or es-mx)
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/acronyms
 *      responses:
 *          '200':
 *              description: The request was received succesfully
 *          '400':
 *              description: Bad request
 *          '500':
 *              description: Internal server error
 */
router.get("/model/:id/lang/:lan", validateToken, 
  param('id').not().isEmpty().trim().escape(), 
  param('lan').not().isEmpty().trim().escape(),
  (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var message = "";
  const client = new MongoClient(mongoURL);
  console.log(mongoURL)

  client.connect(function(err) {
    if (err) {
      console.log(err);
      console.log("Error connecting to MongoDB");
      return res.status(500).json({
        message: "Database connection error"
      });
    } else {
      // console.log("Connected to Mongo!");
      const db = client.db();

      acronym.GetByModelnLanguage(db, req.params.id, req.params.lan, function(result) {
        //close connection with database
        client.close();
        if (result !== null) message = "Acronym dictionary retrieved successfully";
        else {
          message = "No dictionaries found";
          return res.status(404).json({
            error: message
          });
        }
        //json response
        return res.status(200).json({
          message: message,
          result: result
        });
      });
    }
  });
});





/**
 * @swagger
 * /swim-api/acronyms/insert:
 *  post:
 *    description: Creates new acronym catalog document in the acronym catalog collection.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/acronyms
 *    requestBody:
 *       description: Specification of acronym catalog.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modelID:
 *                type: string
 *              lang:
 *                type: string
 *                default: en-us
 *              dictionary:
 *                type: object
 *                items:
 *                  type: string
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
    body("lang").not().isEmpty().trim().escape(),
    check("dictionary", " ").not().isEmpty().trim().escape(),
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
        acronym.CreateAcrCatalog(db, req.body, function (result) {
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
 * /swim-api/acronyms/update/{modelID}:
 *  put:
 *    description: Inserts dictionary value into the acronyms collection only if user has the access level to do so.
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    tags:
 *      - /swim-api/acronyms
 *    parameters:
 *        - in: path
 *          name: modelID
 *          schema:
 *            type: string
 *          required: true 
 *    requestBody:
 *       description: Specification of acronyms collection.
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modelID:
 *                type: string
 *              lang:
 *                type: string
 *                default: en-us
 *              dictionary:
 *                type: object
 *                items:
 *                  type: string
 *                          
 *    responses:
 *          '200':
 *              description: hs-metadata added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
 router.put("/update/:modelID", validateToken, 
    param("modelID").not().isEmpty().trim().escape(),
    check("dictionary", " ").not().isEmpty().trim().escape(),
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
  
    var document = {
      
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
        acronym.UpdateAcrCatalog(db, req.params.modelID, document, function (result) {
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

