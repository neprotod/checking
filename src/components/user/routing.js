const {Router} = require('express');
const passport = require('passport');

const authorization = require('../../auth/index')('custom');

const {
  loginUser,
  loginGoogle,
  registerUser,
  createRole,
  deleteRole,
  updateRole,
  getAllUserRoles,
  logout,
} = require('./controller');
const validation = require('./validation');
const auth = require('../../middlewares/auth');

const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);
route.get('/logout', auth.checkAuth, logout);

// Google
route.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email', 'openid']}),
);

route.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/login'}),
  loginGoogle,
  function(e, req, res, next) {
    return res.status(500).json({errors: e.message});
  },
);

route.post('/roles', auth.checkAuth, validation.createRole, createRole);
route.delete('/roles/:id', auth.checkAuth, deleteRole);
route.put('/roles/:id', auth.checkAuth, updateRole);
route.get('/roles', auth.checkAuth, getAllUserRoles);

module.exports = route;
