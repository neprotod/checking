const {Router} = require('express');
const passport = require('passport');

const authorization = require('../../auth/index')('custom');

const {
  loginUser,
  registerGoogle,
  registerUser,
  createRole,
  deleteRole,
  getAllUserRoles,
  logout,
} = require('./controller');
const validation = require('./validation');
const auth = require('../../middlewares/auth');

const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);
route.get('/logout', auth.checkAuth, logout);

route.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email', 'openid']}),
);
route.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/login'}),
  async function(req, res) {
    const user = req.user;

    // if user have a token, we don't need authorization again
    const check = await authorization.checkAuth(req);
    if (check) {
      return res.status(400).json({errors: ['You are authorized']});
    }

    let token = '';
    try {
      token = await authorization.addUserToSession(user);
    } catch (e) {
      token = await authorization._saveSignature(user);
    }

    res.set('X-Auth-Token', token);

    res.status(200).json(token);
  },
  function(e, req, res, next) {
    return res.status(500).json({errors: e.message});
  },
);

route.post('/roles', auth.checkAuth, validation.createRole, createRole);
route.delete('/roles/:id', auth.checkAuth, deleteRole);
route.get('/roles', auth.checkAuth, getAllUserRoles);

module.exports = route;
