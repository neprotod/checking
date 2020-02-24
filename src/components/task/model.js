const mongoose = require('mongoose');
const {getTasksRoles} = require('../user/model');

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
    const createTask = await await task.save();

    return createTask;
  },

  async createUserTask(data, task) {
    let allTasks = await Tasks.findOne({id_user: data.id_user});

    if (!allTasks) {
      allTasks = new Tasks({id_user: data.id_user, tasks: []});
    }

    allTasks.tasks.push(task._id);

    await allTasks.save();
  },

  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data);
  },

  async deleteTask(id) {
    return await Task.findByIdAndDelete(id);
  },

  async delteUserTask(id, userId) {
    const userTasks = await Tasks.findOne({id_user: userId});

    const newUserTasks = userTasks.tasks.filter(task => id !== task.toString());
    return await Tasks.findOneAndUpdate(
      {id_user: userId},
      {tasks: newUserTasks},
    );
  },

  async getAllUserTask(userId, filter = 'today') {
    const start = new Date('2020.02.25');
    const end = new Date('2020.02.26');

    // const tasks = await Tasks.find({id_user: userId}).populate({
    //   path: 'tasks',
    //   match: {done: false, title: 'only odne'},
    // });
    const match = {start_date: {$gt: start, $lte: end}};
    const tasks = await Tasks.find({id_user: userId}).populate({
      path: 'tasks',
      match,
    });

    const taskRoute = await getTasksRoles(tasks);

    return await Priority.populate(taskRoute, {
      path: 'tasks.priority',
    });
  },

  async getUserTaskMatch(filter = 'today') {
    const start = new Date('2020.02.25');
    const end = new Date('2020.02.26');
    const match = {start_date: {$gt: start, $lte: end}};
  },

  async getAllPriority() {
    return await Priority.find();
  },
};
