const {Router} = require('express');
const route = Router();

const taskController = require('./controller');

route.get('/tasks', taskController.getAllUserTask);
route.post('/tasks', taskController.createTask);
route.put('/tasks/:id', taskController.updateTask);
route.delete('/tasks/:id', taskController.deleteTask);

module.exports = route;
