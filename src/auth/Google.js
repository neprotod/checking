// // TODO: oAuth, maybe passport
// const AuthInterface = require('./interface/AuthInterface');
// /**
//  * Google authorization
//  */
// class Google extends AuthInterface {

// }

// module.exports = Google;
const _ = require('lodash');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Users = require('../components/user/model');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3030/api/user/google/callback',
      },
      async function(accessToken, refreshToken, profile, cb) {
        const checkUser = await Users.getUserByEmail(profile._json.email);

        const err = new Error('User already exist');

        if (!_.isEmpty(checkUser) && !checkUser.googleId) return cb(err);

        Users.User.findOrCreate(
          {googleId: profile.id, email: profile._json.email},
          function(err, user) {
            return cb(err, user);
          },
        );
      },
    ),
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
