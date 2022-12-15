'use strict'; 

var Sequelize = require('sequelize');
var config = require('../../config'),
    db = require('../../database');

//Model schema
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
//Model options
var options = {
 
    timestamps: false,
    freezeTableName: true,
    tablename : 'level'
}
//Table definiton
var Level = db['log'].define('level',modelDefinition,options );

module.exports = Level;