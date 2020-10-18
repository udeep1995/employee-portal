const JwtStratergy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const key = require("../config/keys").secret;

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['jwt'];
  return token;
};

module.exports = function(passport) {  
  var opts = {};
  opts.jwtFromRequest = cookieExtractor; 
  opts.secretOrKey = key;
  passport.use(new JwtStratergy(opts, function(payload, done) {
    User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
  }));
};


