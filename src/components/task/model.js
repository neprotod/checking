const mongoose = require('mongoose');
const {getTasksRoles} = require('../user/model');
const MatchAdapter = require('../../utils/MatchAdapter');

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
  /**
   * Get tasks by role
   *
   * @param {String} userId user id
   * @param {String} roleId role id
   * @return {Array} tasks by role
   */
  async getTasksByRole(userId, roleId) {
    return await Task.find({
      id_user: {$in: [userId]},
      role: {$in: [roleId]},
    });
  },

  /**
   * Create task in tasks db
   *
   * @param {{}} data task object
   * @return {{}} created task
   */
  async createTask(data) {
    const task = new Task(data);
    const createTask = await await task.save();

    return createTask;
  },

  /**
   * Create task in all_tasks db
   *
   * @param {{}} data task request object
   * @param {{}} task task object from tasks db
   * @return {{}} created task
   */
  async createUserTask(data, task) {
    let allTasks = await Tasks.findOne({id_user: data.id_user});

    if (!allTasks) {
      allTasks = new Tasks({id_user: data.id_user, tasks: []});
    }

    allTasks.tasks.push(task._id);

    return await allTasks.save();
  },

  /**
   * Get task by id
   *
   * @param {String} id task id
   * @return {{}} task
   */
  async getTask(id) {
    return await Task.findById(id);
  },

  /**
   * Update task by id
   *
   * @param {String} id task id
   * @param {{}} data object with updated data
   * @return {{}} updated task
   */
  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data);
  },

  /**
   * Delete task by id
   *
   * @param {String} id task id
   * @return {{}} deleted task
   */
  async deleteTask(id) {
    return await Task.findByIdAndDelete(id);
  },

  /**
   * Delete task in all_tasks DB by id
   *
   * @param {String} id task id
   * @param {String} userId user id
   * @return {{}} deleted task
   */
  async deleteUserTask(id, userId) {
    const userTasks = await Tasks.findOne({id_user: userId});

    const newUserTasks = userTasks.tasks.filter(task => id !== task.toString());

    return await Tasks.findOneAndUpdate(
      {id_user: userId},
      {tasks: newUserTasks},
    );
  },

  /**
   * Get tasks with filter for user
   *
   * @param {String} userId user id
   * @param {String} sort task filter param
   * @return {Array} tasks
   */
  async getAllUserTask(userId, sort = 'today') {
    const adapter = new MatchAdapter(sort);
    const match = adapter.getMatch();

    if (!match) throw new Error('Filter not found');

    const tasks = await Tasks.find({id_user: userId}).populate({
      path: 'tasks',
      match,
    });

    const taskRoute = await getTasksRoles(tasks);

    return await Priority.populate(taskRoute, {
      path: 'tasks.priority',
    });
  },

  /**
   * Get all priority
   *
   *
   * @return {Array} priority
   */
  async getAllPriority() {
    return await Priority.find();
  },
};
