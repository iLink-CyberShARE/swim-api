// routes/api.js

"use strict";

var router = require("express").Router();
const { body, param, validationResult } = require('express-validator');
var config = require("../../config");
const LoggerController = require("../controllers/loggerController");
const validateToken = require("../../utils").validateToken;

//Routes for logger endpoints
var LoggerRoutes = function(passport) {

  /**
   * @swagger
   * /swim-logger-api/level:
   *  post:
   *    description: Log level insertion.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-logger
   *    requestBody:
   *       description: Name of the level.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *    responses:
   *          '201':
   *              description: Level added successfully
   *          '403':
   *              description: Handled server error
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post("/level", validateToken, LoggerController.levelInsert);

  /**
   * @swagger
   * /swim-logger-api/eventcategory:
   *  post:
   *    description: Log category insertion.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-logger
   *    requestBody:
   *       description: Name of the category.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *    responses:
   *          '201':
   *              description: Category added successfully
   *          '403':
   *              description: Handled server error
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post(
    "/eventcategory",
    validateToken,
    body('name').not().isEmpty().trim().escape().isAlpha(),
    LoggerController.eventCategoryInsert
  );

  /**
   * @swagger
   * /swim-logger-api/executionlog:
   *  post:
   *    description: Log a model execution entry. 
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-logger
   *    requestBody:
   *       description: Model, scenario and status.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              modelId:
   *                type: string
   *              userScenarioId:
   *                type: string
   *              status:
   *                type: string
   *    responses:
   *          '201':
   *              description: Category added successfully
   *          '403':
   *              description: Handled server error
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post(
    "/executionlog",
    validateToken,
    body('modelId').not().isEmpty().trim().escape(), 
    body('userScenarioId').not().isEmpty().trim().escape(), 
    body('status').not().isEmpty().trim().escape(), 
    LoggerController.executionLogInsert
  );

  /**
   * @swagger
   * /swim-logger-api/updaterunstatus:
   *  post:
   *    description: Update a model execution entry with start and end times. 
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-logger
   *    requestBody:
   *       description: Update time lapses.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              modelId:
   *                type: string
   *              userScenarioId:
   *                type: string
   *              startTime:
   *                type: string
   *              endTime:
   *                type: string
   *              status:
   *                type: string
   *    responses:
   *          '201':
   *              description: Category added successfully
   *          '403':
   *              description: Handled server error
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post("/updaterunstatus", 
    validateToken, 
    body('modelId').not().isEmpty().trim().escape(),
    body('userScenarioId').not().isEmpty().trim().escape(),
    body('status').not().isEmpty().trim().escape(),
    LoggerController.executionLogUpdateStatus);

  /**
   * @swagger
   * /swim-logger-api/eventlog:
   *  post:
   *    description: Log a system event. 
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-logger
   *    requestBody:
   *       description: Event details.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              level:
   *                type: integer
   *              category:
   *                type: integer
   *              message:
   *                type: string
   *    responses:
   *          '201':
   *              description: Event logged successfully
   *          '403':
   *              description: Handled server error
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post("/eventlog", 
    validateToken, 
    body('level').not().isEmpty().trim().escape().isNumeric(),
    body('category').not().isEmpty().trim().escape().isNumeric(),
    body('message').not().isEmpty().trim().escape(),
    LoggerController.eventLogInsert);
  return router;
};

module.exports = LoggerRoutes;
