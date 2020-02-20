const {Router} = require('express');
const route = Router();

const tasksRouters = require('./task/routing');
const userRouters = require('./user/routing');


// TODO All routing
route.use('/tasks', tasksRouters);
route.use('/user', userRouters);

module.exports = route;
