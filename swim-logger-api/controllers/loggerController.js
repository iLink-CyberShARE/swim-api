// controllers/authController.js

"use strict";

var config = require("../../config"),
  db = require("../../database"),
  level = require("../models/level"),
  event_category = require("../models/eventCategory"),
  execution_log = require("../models/executionLog"),
  event_log = require("../models/eventLog")

const { validationResult } = require('express-validator');

var LoggerController = {};

/**
 * Insert a level into the level table
 */
LoggerController.levelInsert = function(req, res) {
  if (req.decoded.cont !== 1) {
    return res.status(401).json({
      error: "Access denied.",
    });
  }

  // validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  


  if (!req.body.name) {
    res.json({ message: "Please provide name" });
  } else {
    db["log"]
      .sync()
      .then(function() {
        var newLevel = {
          name: req.body.name
        };
        return level.create(newLevel).then(function() {
          res.status(201).json(newLevel);
        });
      })
      .catch(function(error) {
        var newEventLog = {
          level_id: 5,
          event_category_id: 3,
          message: "node server error: " + error,
          user_id: req.decoded.id
        };
        event_log.create(newEventLog);
        res.status(403).json({ message: error });
      });
  }
};

/**
 * Insert an event category to DB
 */
LoggerController.eventCategoryInsert = function(req, res) {
  if (req.decoded.cont !== 1) {
    return res.status(401).json({
      error: "Access denied.",
    });
  }

  // validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  if (!req.body.name) {
    res.json({ message: "Please provide name" });
  } else {
    db["log"]
      .sync()
      .then(function() {
        var newEventCat = {
          name: req.body.name
        };

        return event_category.create(newEventCat).then(function() {
          res.status(201).json(newEventCat);
        });
      })
      .catch(function(error) {
        var newEventLog = {
          level_id: 5,
          event_category_id: 3,
          message: "node server error: " + error,
          user_id: req.decoded.id
        };
        event_log.create(newEventLog);
        res.status(403).json({ message: error });
      });
  }
};

/**
 * Insert an event log into DB
 */
LoggerController.eventLogInsert = function(request, res) {

  // validations
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  db["log"]
    .sync()
    .then(function() {
      var newEventLog = {
        level_id: request.body.level,
        event_category_id: request.body.category,
        message: request.body.message,
        user_id: request.decoded.id
      };

      return event_log.create(newEventLog).then(function() {
        res.status(201).json(newEventLog);
      });
    })
    .catch(function(error) {
      var newEventLog = {
        level_id: 5,
        event_category_id: 3,
        message: "node server error: " + error,
        user_id: request.decoded.id
      };
      event_log.create(newEventLog);
      res.status(403).json({ message: error });
    });
};
/**
 * Insert an execution log into DB
 */
LoggerController.executionLogInsert = function(request, res) {

  // validations
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  db["log"]
    .sync()
    .then(function() {
      var newExecLog = {
        model_id: request.body.modelId,
        userscenario_id: request.body.userScenarioId,
        status: request.body.status
      };

      return execution_log.create(newExecLog).then(function() {
        res.status(201).json(newExecLog);
      });
    })
    .catch(function(error) {
      var newEventLog = {
        level_id: 5,
        event_category_id: 3,
        message: "node server error: " + error,
        user_id: request.decoded.id
      };
      event_log.create(newEventLog);
      res.status(500).json({ message: error });
    });
};

/**
 * Update information of an execution entry
 */
LoggerController.executionLogUpdateStatus = function(request, res) {

  // validations
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  var startDateTime = null;
  var endDateTime = null;

  // convert the date-times here (temporary fix)
  var start = request.body.startTime;
  if (start !== null && typeof start !== "undefined") {
    var startParts = start.split(".");
    startDateTime = new Date(
      startParts[0],
      startParts[1] - 1,
      startParts[2],
      startParts[3],
      startParts[4],
      startParts[5]
    );
  }

  var end = request.body.endTime;
  if (end !== null && typeof end !== "undefined") {
    var endParts = end.split(".");
    endDateTime = new Date(
      endParts[0],
      endParts[1] - 1,
      endParts[2],
      endParts[3],
      endParts[4],
      endParts[5]
    );
  }

  // update the database synchronously
  db["log"]
    .sync()
    .then(function() {
      return execution_log
        .update(
          {
            status: request.body.status,
            start_time: startDateTime,
            end_time: endDateTime
          },
          {
            where: {
              model_id: request.body.modelId,
              userscenario_id: request.body.userScenarioId
            }
          }
        )
        .then(function(rowsUpdated) {
          res.status(201).json(rowsUpdated);
        });
    })
    .catch(function(error) {
      var newEventLog = {
        level_id: 5,
        event_category_id: 3,
        message: "node server error: " + error,
        user_id: request.decoded.id
      };
      event_log.create(newEventLog);
      res.status(500).json({ message: error });
    });
};

module.exports = LoggerController;
