const express = require("express");
const { param, validationResult } = require('express-validator');
const config = require('../../config');
const mongoURL = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;
const SummaryCatalog = require("../models/summary-catalog");
const validateToken = require("../../utils").validateToken;
const router = express.Router();

router.get("/swim-api/summaries");

// instantiate summary catalog model
summary = new SummaryCatalog();

/**
 * @swagger
 * /swim-api/summaries/{modelid}:
 *   get:
 *      description: Get all summary entries by model identifier.
 *      parameters:
 *        - in: path
 *          name: modelid
 *          schema:
 *            type: string
 *          required: true
 *      tags:
 *        - /swim-api/summaries
 *      produces:
 *        - application/json
 *      responses:
 *          '200':
 *              description: Summaries retrieved successfully
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: No summaries found
 *          '500':
 *              description: Internal server error
 */
router.get("/:modelid", validateToken, 
  param('modelid').not().isEmpty().trim().escape(),
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
      summary.GetByModel(db, req.params.modelid, function(result) {
        //close connection with database
        client.close();
        if (result.length > 0) message = "Summaries retrieved successfully";
        else {
          message = "No scenario summaries found";
          // success response
          return res.status(404).json({
            error: message
          });
        }
        // error response
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
