const {Router} = require('express');
const {loginUser, registerUser, logout} = require('./controller');
const validation = require('./validation');
const auth = require('../../middlewares/auth');


const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);
route.get('/logout', auth.checkAuth, logout);

module.exports = route;
