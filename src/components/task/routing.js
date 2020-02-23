const {Router} = require('express');

const route = Router();

const taskController = require('./controller');

route.get('/', taskController.getAllUserTask);
route.get('/priorities', taskController.getAllPriority);
route.post('/', taskController.createTask);
route.put('/:id', taskController.updateTask);
route.delete('/:id', taskController.deleteTask);

module.exports = route;
