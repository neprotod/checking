const mongoose = require('mongoose');
require('../user/model');

const {Schema} = mongoose;

const taskSchema = new Schema({
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
    type: String,
    required: true,
  },
  end_date: {
    type: String,
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
  tasks: [
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
  async createTask(data) {
    const task = new Task(data);
    const createTask = await task.save();
    let allTasks = await Tasks.findOne({id_user: data.id_user});

    if (!allTasks) {
      allTasks = new Tasks({id_user: data.id_user, tasks: []});
    }

    allTasks.tasks.push(createTask._id);
    await allTasks.save();

    return allTasks;
  },

  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data);
  },

  async deleteTask(id, userId) {
    const userTasks = await Tasks.findOne({id_user: userId});

    const newUserTasks = userTasks.tasks.filter(task => id !== task.toString());

    await Tasks.findOneAndUpdate({id_user: userId}, {tasks: newUserTasks});
    return await Task.findByIdAndDelete(id);
  },

  async getAllUserTask(userId) {
    return await Tasks.find({id_user: userId})
      .populate('tasks')
      .sort({date: 'desc'});
  },

  async getAllPriority() {
    return await Priority.find();
  },
};
