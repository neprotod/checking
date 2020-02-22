const {Router} = require('express');
const validate = require('./validation');

const route = Router();

const taskController = require('./controller');

route.get('/', taskController.getAllUserTask);
route.post('/', validate.createTask, taskController.createTask);
route.put('/:id', taskController.updateTask);
route.delete('/:id', taskController.deleteTask);

module.exports = route;
