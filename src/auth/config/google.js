const GoogleStrategy = require('passport-google-oauth20').Strategy;
const _ = require('lodash');

const config = require('../../../config');

const Users = require('../../components/user/model');


const accessCallback =  async function(accessToken, refreshToken, profile, cb) {
  const checkUser = await Users.getUserByEmail(profile._json.email);

  const err = new Error('User already exist');
  err.code = '0001';

  if (!_.isEmpty(checkUser) && !checkUser.googleId) return cb(err);

  Users.User.findOrCreate(
    {googleId: profile.id, email: profile._json.email},
    function(err, user) {
      return cb(err, user);
    },
  );
}

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: config.googleCallback,
      },
      accessCallback,
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
