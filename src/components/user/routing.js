const {Router} = require('express');
const {loginUser, registerUser} = require('./controller');
const validation = require('./validation');

const route = Router();

route.post('/login', validation.registration, loginUser);
route.post('/register', validation.registration, registerUser);

module.exports = route;
