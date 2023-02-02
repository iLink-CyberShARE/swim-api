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
    model_id: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    userscenario_id :{
        type : Sequelize.STRING,
        allowNull: false
    },
    start_time : {
        type : Sequelize.DATE,
        allowNull: true
    },
    end_time : {
        type : Sequelize.DATE,
        allowNull: true
    },
    status : {
        type : Sequelize.STRING
    },
    error_msg :{
        type : Sequelize.STRING,

    },
    error_trace : {
        type : Sequelize.TEXT,

    },
    error_service_id : {
        type : Sequelize.STRING
    }
}
//Model options
var options = {

    timestamps: false,
    freezeTableName: true,
    tablename : 'execution_log'
}
//DB definition
var ExecutionLog = db['log'].define('execution_log',modelDefinition,options)
module.exports = ExecutionLog;
