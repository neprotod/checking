const {Router} = require('express');
const {
  loginUser,
  registerUser,
  createRole,
  deleteRole,
  getAllUserRoles,
} = require('./controller');
const validation = require('./validation');
const auth = require('../../middlewares/auth');

const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);
route.post('/roles', auth.checkAuth, validation.createRole, createRole);
route.delete('/roles/:id', auth.checkAuth, deleteRole);
route.get('/roles', auth.checkAuth, getAllUserRoles);

module.exports = route;
