// app/models/user.js

// The User model.
'use strict';

var Sequelize = require('sequelize');
var db = require('../../database');

var crypto = require('crypto');

// 1: The model schema.
var modelDefinition = {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uemail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate : {
          isEmail: true
        }
    },
    upassword: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ufirst_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ulast_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    uinstitution: {
        type: Sequelize.STRING,
        allowNull: true
    },
    udepartment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    urole : {
        type: Sequelize.STRING,
        allowNull: true
    },
    is_guest : {
        type: Sequelize.TINYINT,
    },
    is_contentmanager : {
      type: Sequelize.TINYINT,
    },
    is_active : {
      type: Sequelize.TINYINT
    }

};

// 2: The model options.
var modelOptions = {
    timestamps: false,
    freezeTableName: true,
    tablename : 'USER',
    hooks: {
        beforeValidate: hashPassword
    }
};

// 3: Define the User model.
var UserModel = db['auth'].define('USER', modelDefinition, modelOptions);

// Compares two passwords.
UserModel.comparePasswords = function(password,user) {
    var hash = crypto.createHash('sha1').update(password).digest('hex')
    return hash === user.upassword;
}

// Hashes the password for a user object.
function hashPassword(user) {
    if(user.changed('upassword')) {
        var hash = crypto.createHash('sha1').update(user.upassword).digest('hex')
        user.upassword = hash;

    }
}

module.exports = UserModel;
