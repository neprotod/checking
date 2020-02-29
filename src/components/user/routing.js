const {Router} = require('express');

const {
  loginUser,
  registerUser,
  createRole,
  deleteRole,
  updateRole,
  getAllUserRoles,
  logout
} = require('./controller');
const validation = require('./validation');
const auth = require('../../middlewares/auth');

const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);
route.get('/logout', auth.checkAuth, logout);

route.post('/roles', auth.checkAuth, validation.createRole, createRole);
route.delete('/roles/:id', auth.checkAuth, deleteRole);
route.put('/roles/:id', auth.checkAuth, updateRole);
route.get('/roles', auth.checkAuth, getAllUserRoles);


module.exports = route;
