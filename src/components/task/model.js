const mongoose = require('mongoose');
require('../user/model');

const {Schema} = mongoose;

const taskSchema = new Schema({
  id_user: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
  ],
  id_role: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user_rolesы',
    },
  ],
  id_priority: [
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
  },
});

const allTasksSchema = new Schema({
  id_task: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'tasks',
    },
  ],
  id_user: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
  ],
});

const prioritySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
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
