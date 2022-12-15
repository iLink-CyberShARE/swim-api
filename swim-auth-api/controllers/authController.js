// controllers/authController.js

"use strict";

var jwt = require("jsonwebtoken");
var crypto = require("crypto");

var config = require("../../config"),
  db = require("../../database"),
  User = require("../models/user");
var EventLog = require("../../swim-logger-api/models/eventLog");

var hush = require("../../hush");

var https = require('https');
var fs = require('fs');

const { validationResult } = require('express-validator');

// The authentication controller.
var AuthController = {};

/**
 * Handle user registration
 * @param req http request
 * @param res http response
 */
AuthController.signUp = function (req, res) {

  // validations
  // const errors = validationResult(req);
  //if (!errors.isEmpty()) {
  //  return res.status(400).json({ errors: errors.array() });
  //}  

  //check required fields
  if (!req.body.email || !req.body.password) {
    res.json({ message: "Please provide email and a password." });
  } else {
    db["auth"]
      .sync()
      .then(function () {
        //create a new user with the given data
        var newUser = {
          uemail: req.body.email,
          upassword: req.body.password,
          ufirst_name: req.body.firstname,
          ulast_name: req.body.lastname,
          uinstitution: req.body.institution,
          udepartment: req.body.department,
          urole: req.body.role,
          is_guest: 1,
        };

        //insert user into DB. Sign jwt token with email and id
        return User.create(newUser).then(async function (user) {
          // call email validation key sender
          // GenerateEmailUrl(user.dataValues.uemail);
          var secret = await hush.readHush();
          var token = jwt.sign(
            { email: user.dataValues.uemail, id: user.dataValues.uid },
            secret,
            { expiresIn: "90m" }
          );
          res.status(201).json({
            idToken: "JWT " + token,
            email: user.dataValues.uemail,
            role: user.dataValues.urole,
            expiresIn: 5400000,
            id: user.dataValues.uid,
            success: true,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
        var newEventLog = {
          level_id: 5,
          event_category_id: 1,
          message: "signup error: " + error,
          user_id: null,
        };
        EventLog.create(newEventLog);
        if (error.name && error.name === "SequelizeUniqueConstraintError") {
          res
            .status(500)
            .json({ message: "Email address already registered." });
          return;
        }
        res.status(500).json({ error });
      });
  }
};

/**
 * Changes password of connected user
 * @param {*} req http request
 * @param {*} res http response
 */
AuthController.changePassword = function (req, res) {

  // validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  // validate field arrival
  if (!req.body.newP || !req.body.oldP) {
    res.status(500).json({ message: "Invalid inputs" });
  }

  var currentPassword = req.body.oldP;
  var newPassword = req.body.newP;
  var userID = req.decoded.id;

  var query = { where: { uid: userID } };
  User.findOne(query)
    .then(async function (user) {
      if (!user) {
        var newEventLog = {
          level_id: 4,
          event_category_id: 1,
          message: "user not found: " + userID,
          user_id: userID,
        };
        EventLog.create(newEventLog);
        res.status(404).json({ message: "User not found" });
      } else {
        var isMatch = User.comparePasswords(currentPassword, user);
        if (isMatch && user.dataValues.is_active === 1) {
          // set new password
          user.upassword = newPassword;
          // save hashed password to the database
          await user.save({ fields: ["upassword"] });
          res.status(200).json({ message: "Password changed successfully" });
        } else {
          // log to the database here error on login cat 1 - level 5
          var newEventLog = {
            level_id: 4,
            event_category_id: 1,
            message:
              "error on change, password incorrect: " + user.dataValues.uemail,
            user_id: userID,
          };
          EventLog.create(newEventLog);
          res.status(500).json({ message: "Current password is incorrect" });
        }
      }
    })
    .catch(function (error) {
      var newEventLog = {
        level_id: 5,
        event_category_id: 1,
        message: "change password error: " + error,
        user_id: null,
      };
      EventLog.create(newEventLog);
      res.status(403).json({ message: newEventLog.message });
    });
};

/**
 * Handle user login
 * @param req http request
 * @param res http response
 */
AuthController.authenticateUser = function (req, res) {

  //validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }  

  //check required fields
  if (!req.body.isGuest && (!req.body.email || !req.body.password)) {
    res.status(404).json({ message: "Username and password are needed!" });
  } else {
    // TODO: Currently hardcoded user for non login credentials - security risk?
    if (req.body.isGuest) {
      req.body.email = config.guest.user;
      req.body.password = config.guest.password;
    }
    //find user with given email in DB
    var email = req.body.email,
      password = req.body.password,
      potentialUser = { where: { uemail: email } };
    User.findOne(potentialUser)
      .then(async function (user) {
        if (!user) {
          var newEventLog = {
            level_id: 4,
            event_category_id: 1,
            message: "user not found: " + req.body.email,
            user_id: null,
          };
          EventLog.create(newEventLog);
          res.status(404).json({ message: "Authentication failed!" });
        } else {
          //Password validation
          var isMatch = User.comparePasswords(password, user);
          var secret = await hush.readHush();
          if (isMatch && user.dataValues.is_active === 1) {
            if (!req.body.isGuest) {
              var newEventLog = {
                level_id: 3,
                event_category_id: 1,
                message: "User logged in or renewed token",
                user_id: user.dataValues.uid,
              };
              EventLog.create(newEventLog);
            }
            //sign token
            const data = {
              email: user.dataValues.uemail,
              id: user.dataValues.uid,
              cont: user.dataValues.is_contentmanager,
            };
            var token = jwt.sign(data, secret, {
              expiresIn: "90m",
            });

            res.json({
              idToken: "JWT " + token,
              email: user.uemail,
              expiresIn: 5400000,
              id: user.uid,
              role: user.urole,
              cont: user.is_contentmanager,
              success: true,
            });
          } else {
            // log to the database here error on login cat 1 - level 5
            var newEventLog = {
              level_id: 4,
              event_category_id: 1,
              message: "error on loggin, password incorrect: ",
              user_id: null,
            };
            EventLog.create(newEventLog);
            res.status(404).json({ message: "Login failed!" });
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        var newEventLog = {
          level_id: 5,
          event_category_id: 1,
          message: "authentication error: " + error,
          user_id: null,
        };
        EventLog.create(newEventLog);
        res.status(403).json({ message: newEventLog.message });
      });
  }
};

/** helper functions */

function GenerateEmailUrl(email) {
  var options = {
    'method': 'POST',
    'hostname': 'water.cybershare.utep.edu',
    'port': 443,
    'path': '/register/GenerateUniqueURLService',
    'headers': {
    },
    'maxRedirects': 20
  };

  try{
    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"email\"\r\n\r\n"+email+"\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
    req.write(postData);
    req.end();
  }
  catch(e) {
    console.log(e);
    var newEventLog = {
      level_id: 5,
      event_category_id: 5,
      message: "Failed to call email verification",
      user_id: null,
    };
    EventLog.create(newEventLog);
  }

}

module.exports = AuthController;
