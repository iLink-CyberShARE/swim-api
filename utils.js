const jwt = require('jsonwebtoken');
const config = require('./config');
const hush = require('./hush');

module.exports = {
  validateToken: async(req, res, next) => {
    //next(); //temporal bypass
    //return; //temporal bypass
    const authorizationHeader = req.headers.authorization;
    let result;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: '90m',
      };
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        var secret = await hush.readHush();
        result = jwt.verify(token,secret, options);
        // Let's pass back the decoded token to the request object
        req.decoded = result;
        // We call next to pass execution to the subsequent middleware
        next();
      } catch (error) {
        // Throw an error just in case anything goes wrong with verification
        console.log(error + 'token error');
        res.status(403).json({ message: error });
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
};
