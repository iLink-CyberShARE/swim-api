const express = require("express");
const { param, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const SetCatalog = require("../models/set-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/sets");

//instantiate acronym catalog model
set = new SetCatalog();

/**
 * @swagger
 * /swim-api/sets/model/{id}:
 *   get:
 *      description: Get model set metadata.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *        - application/json
 *      tags:
 *        - /swim-api/sets
 *      responses:
 *          '200':
 *              description: Model sets retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No sets found
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
      set.GetByModel(db, req.params.id, function(result) {
        //close connection with database
        client.close();
        if (result !== null) message = "Set catalog retrieved successfully";
        else {
          message = "No sets found";
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

module.exports = router;

