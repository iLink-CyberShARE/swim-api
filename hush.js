// controllers/authController.js

'use strict';
var Sequelize = require('sequelize');
// var jwt = require('jsonwebtoken');
// var config = require('./config');
var db = require('./database');

/*
Model
*/
// 1: The model schema.
var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: Sequelize.STRING,
        unique: true,
    },
};

// 2: The model options.
var modelOptions = {
    timestamps: false,
    freezeTableName: true,
    tablename : 'hush'
};
// 3: Define the User model.
var Hush = db['log'].define('hush', modelDefinition, modelOptions);

// The authentication controller.
var HushController = {};

HushController.readHush = function() {

        //find user with given email in DB
        var secret = { where: { id: 1 } };
        return Hush.findOne(secret).then(function(secret) {


            if(!secret) {
                //No user found
                console.log("Secret was not found")
            }
            else{
                return secret.value;
            }
        }
        ).catch(function(error) {
            console.log(error);
            console.log("Error reading secret");
        });
}

module.exports = HushController;
