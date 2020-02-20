const {Router} = require('express');
const {loginUser, registerUser} = require('./controller');

const route = Router();

route.post('/login', loginUser);
route.post('/register', registerUser);

module.exports = route;
