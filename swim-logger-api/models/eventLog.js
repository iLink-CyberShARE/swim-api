var Sequelize = require('sequelize');
var config = require('../../config'),
    db = require('../../database');

//Model schema
var modelDefinition = {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    level_id: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    event_category_id :{
        type : Sequelize.INTEGER,
        allowNull: false
    },
    message : {
        type : Sequelize.STRING,
        allowNull: false
    },
    user_id : {
        type : Sequelize.INTEGER
    }
}

//Model options
var options = {

    timestamps: false,
    freezeTableName: true,
    tablename : 'event_log'
}
//DB definition
var EventLog = db['log'].define('event_log', modelDefinition, options)

module.exports = EventLog;
