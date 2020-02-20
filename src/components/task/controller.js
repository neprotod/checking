const TaskModel = require('./model');

module.exports = {
  async getAllRecipes(req, res) {
    try {
      const tasks = await TaskModel.getAllTasks(req.body);
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },

  async createTask(req, res) {
    try {
      const task = await TaskModel.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },

  async updateTask(req, res) {
    try {
      const {id} = req.params;
      const task = await TaskModel.updateTask(id, req.body);
      res.status(200).json(task);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },

  async deleteTask(req, res) {
    try {
      const task = await TaskModel.deleteTask(req.params.id);
      res.status(200).json(task);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },

  async getAllPriority(req, res) {
    try {
      const priority = await TaskModel.getAllPriority();
      res.status(200).json(priority);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },

  async getAllUserTask(req, res) {
    try {
      const tasks = await TaskModel.getAllUserTask(req.params.id);
      // лібо тут с боді брати
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Database error: ', err.message);
      res.status(500).json({errors: 'Database error'});
    }
  },
};
