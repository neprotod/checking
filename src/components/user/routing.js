const {Router} = require('express');
const passport = require('passport');

const {
  loginUser,
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
  function(req, res) {
    const user = req.user;
    res.json(user);
  },
);

route.post('/roles', auth.checkAuth, validation.createRole, createRole);
route.delete('/roles/:id', auth.checkAuth, deleteRole);
route.get('/roles', auth.checkAuth, getAllUserRoles);

module.exports = route;
