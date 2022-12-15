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
  varName: {
    type : Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type : Sequelize.INTEGER,
    allowNull: false
  },
  timestamp : {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: true
  },
  canned_id: {
    type : Sequelize.STRING,
    allowNull: true
  },
  run_id: {
    type : Sequelize.STRING,
    allowNull: true
  },
  role: {
    type : Sequelize.STRING,
    allowNull: true
  }
}

//Model options
var options = {
  timestamps: false,
  freezeTableName: true,
  tablename : 'nav2_log'
}
//DB definition
var NavLog = db['log'].define('nav2_log',modelDefinition,options)
module.exports = NavLog;
