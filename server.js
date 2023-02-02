const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

var AuthController = require("./swim-auth-api/controllers/authController");
var config = require("./config");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log("SWIM 2.0 Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Check if the user database is empty, if so create the users

console.log('Creating Content Manager...');
AuthController.createUsers(config.admin.user, config.admin.password, 1);

console.log('Creating Guest User...');
AuthController.createUsers(config.guest.user, config.guest.password, 0);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
