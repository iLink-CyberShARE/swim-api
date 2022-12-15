// app/services/passportStrategy.js

'use strict';

var JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user'),
    config = require('../../config');

var hush = require('../../hush');
// Hooks the JWT Strategy.
async function hookJWTStrategy(passport) {

    var options = {};
     //find user with given email in DB

    options.secretOrKey = await hush.readHush();
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
    options.ignoreExpiration = false;

    passport.use(new JWTStrategy(options, function(JWTPayload, callback) {
        User.findOne({ where: { uemail: JWTPayload.email } })
            .then(function(user) {
                if(!user) {
                    callback(null, false);
                    return;
                }
                callback(null, user);
            });
    }));
}

module.exports = hookJWTStrategy;
