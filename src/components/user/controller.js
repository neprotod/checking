// loginUser, registerUser
const User = require('./model');

const registerUser = async (req, res) => {
  try {
    const result = await User.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await User.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
