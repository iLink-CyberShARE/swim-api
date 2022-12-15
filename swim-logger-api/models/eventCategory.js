'use strict'; 

var Sequelize = require('sequelize');
var config = require('../../config'),
    db = require('../../database');

/**
 * Model schema
 */
var modelDefinition = {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull : false
    },
    name: {
        type : Sequelize.STRING,
        allowNull : false
    }  
};
/**
 * Model options
 */
var options = {
    timestamps: false,
    freezeTableName: true,
    tablename : 'event_category'
}

//Define db table
var EventCategory = db['log'].define('event_category',modelDefinition,options );

module.exports = EventCategory;