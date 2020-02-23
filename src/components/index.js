const {Router} = require('express');

const route = Router();

const tasksRouters = require('./task/routing');
const userRouters = require('./user/routing');
const auth = require('../middlewares/auth');

// TODO All routing
route.use('/tasks', auth.checkAuth, tasksRouters);
route.use('/user', userRouters);

module.exports = route;
