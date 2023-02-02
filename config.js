"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var config = module.exports;

/* semantic context URI */
config.context = process.env.CONTEXT;

/** Server URL for Swagger */
config.server = {
  url: process.env.APPURL,
  description: process.env.SERVERDESCRIPTION
};

/** Logger database */
config.db = {
  user: process.env.LUSER,
  password: process.env.LPASSWORD,
  name: process.env.LNAME
};

config.db.details = {
  host: process.env.LHOST,
  port: process.env.LPORT,
  dialect: process.env.LDIALECT,
};

/** Authentication Database */
config.db2 = {
  user: process.env.UUSER,
  password: process.env.UPASSWORD,
  name: process.env.UNAME,
};

config.db2.details = {
  host: process.env.UHOST,
  port: process.env.UPORT,
  dialect: process.env.UDIALECT
};

/** SWIM Core database (mongodb) */
config.mongoDB = {
  user: process.env.SUSER,
  password: process.env.SPASSWORD,
  name: process.env.SNAME,
  host: process.env.SHOST,
  port: process.env.SPORT,
  authsource: process.env.SAUTH
};

/** Admin user account (admin login) */
config.admin = {
  user: process.env.AUSER,
  password: process.env.APASSWORD,
};

/** Guest user account (guest login) */
config.guest = {
  user: process.env.GUSER,
  password: process.env.GPASSWORD,
};





