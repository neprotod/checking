const mongoose = require('mongoose');
require('../user/model');

const {Schema} = mongoose;

const taskSchema = new Schema({
  // Maybe this don't need, because we have this id in allTasksSchema
  id_user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  role: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user_roles',
    },
  ],
  priority: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'priorities',
    },
  ],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const allTasksSchema = new Schema({
  id_user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
  },
  task: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'tasks',
    },
  ],
});

const prioritySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
});

const Task = mongoose.model('tasks', taskSchema);

const Tasks = mongoose.model('all_tasks', allTasksSchema);

const Priority = mongoose.model('priorities', prioritySchema);

module.exports = {
  async getAllTasks() {
    return await Task.find().sort({date: 'desc'});
  },

  async createTask(data) {
    const task = new Task(data);
    return await task.save();
  },

  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data);
  },

  async deleteTask(id) {
    return await Task.findByIdAndDelete(id);
  },

  // change Tasks
  async getAllUserTask(userId) {
    return await Tasks.find({id_user: userId});
  },

  async getAllPriority() {
    return await Priority.find();
  },
};
