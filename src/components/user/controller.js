// loginUser, registerUser
const User = require('./model');

module.exports = {
  async registerUser(req, res) {
    try {
      const result = await User.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  async loginUser(req, res) {
    try {
      const result = await User.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
};
