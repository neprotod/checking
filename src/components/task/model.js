const mongoose = require('mongoose');
const User = require('../user/model');

const taskSchema = mongoose.Schema({});

const allTasksSchema = mongoose.Schema({});
const prioritySchema = mongoose.Schema({});

const Task = mongoose.model('tasks', taskSchema);

const Tasks = mongoose.model('all_tasks', allTasksSchema);

const Priority = mongoose.model('priorities', prioritySchema);

module.exports = {
  // TODO: all abstraction to database
};
