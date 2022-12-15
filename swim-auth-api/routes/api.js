// routes/api.js

"use strict";

var router = require("express").Router();
const { body, validationResult } = require("express-validator");

var AuthController = require("../controllers/authController");
const validateToken = require("../../utils").validateToken;

// User routes
var APIRoutes = function (passport) {
  // TODO: tests generated error UNABLE_TO_VERIFY_LEAF_SIGNATURE but the insert worked ok (need revise this).
  /**
   * @swagger
   * /swim-auth-api/signup:
   *  post:
   *    description: SWIM user registration endpoint.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-auth-api
   *    security:
   *      - {}
   *    requestBody:
   *       description: User registration fields.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              firstname:
   *                type: string
   *              lastname:
   *                type: string
   *              email:
   *                type: string
   *              institution:
   *                type: string
   *              department:
   *                type: string
   *              role:
   *                type: string
   *              password:
   *                type: string
   *    responses:
   *          '201':
   *              description: User registered successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  router.post(
    "/signup",
    body("firstname").not().isEmpty().trim().escape().isAlpha(),
    body("lastname").not().isEmpty().trim().escape().isAlpha(),
    body("email").isEmail().normalizeEmail(),
    body("institution").not().isEmpty().trim().escape().isAlphanumeric(),
    body("department").not().isEmpty().trim().escape().isAlphanumeric(),
    body("role").optional({ checkFalsy: true }).escape(),
    body("password")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    AuthController.signUp
  );

  /**
   * @swagger
   * /swim-auth-api/authenticate:
   *  post:
   *    description: Authentication token generator. Use just the token value after JWT to access endpoints.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-auth-api
   *    security:
   *      - {}
   *    requestBody:
   *       description: account email, guest flag and password
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                required: true
   *              password:
   *                type: string
   *                required: true
   *    responses:
   *          '200':
   *              description: Access granted
   *          '403':
   *              description: Handled error
   *          '404':
   *              description: Authentication error
   *          '500':
   *              description: Internal server error
   */
  router.post(
    "/authenticate",
    body("email").isEmail().normalizeEmail(),
    body("password").not().isEmpty().trim().escape(),
    AuthController.authenticateUser
  );

  /**
   * @swagger
   * /swim-auth-api/authenticateGuest:
   *  post:
   *    description: Authentication token generator for user interface guest. Use just the token value after JWT to access endpoints.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-auth-api
   *    security:
   *      - {}
   *    requestBody:
   *       description: Set guest flag to 1 to receive a guest level token.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              isGuest:
   *                type: boolean
   *                required: true
   *                example: true
   *    responses:
   *          '200':
   *              description: Access granted
   *          '403':
   *              description: Handled error
   *          '404':
   *              description: Authentication error
   *          '500':
   *              description: Internal server error
   */
  router.post(
    "/authenticateGuest",
    body("isGuest").trim().escape().isBoolean().default(1),
    AuthController.authenticateUser
  );

  /**
   * @swagger
   * /swim-auth-api/change:
   *  post:
   *    description: Change password of currently logged in user.
   *    produces:
   *      - application/json
   *    consumes:
   *      - application/json
   *    tags:
   *      - /swim-auth-api
   *    requestBody:
   *       description: Current and new password.
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              oldP:
   *                type: string
   *              newP:
   *                type: string
   *    responses:
   *          '201':
   *              description: Password changed successfully
   *          '401':
   *              description: User not found
   *          '400':
   *              description: Bad request
   *          '500':
   *              description: Internal server error
   */
  router.post(
    "/change",
    validateToken,
    body("oldP")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    body("newP")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    AuthController.changePassword
  );

  return router;
};

module.exports = APIRoutes;
