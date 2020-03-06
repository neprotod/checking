const {Router} = require('express');
const validate = require('./validation');

const route = Router();

const taskController = require('./controller');

route.get('/', taskController.getAllUserTask);
route.post('/', validate.createTask, taskController.createTask);
route.get('/priority', taskController.getAllPriority);
route.put('/:id', validate.updateTask, taskController.updateTask);
route.get('/:id', taskController.getTask);
route.delete('/:id', taskController.deleteTask);




module.exports = route;
