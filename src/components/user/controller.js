// loginUser, registerUser
const User = require('./model');
const auth = require('../../auth')('custom');
const Role = require('./model');

module.exports = {
  async registerUser(req, res) {
    try {
      const {email, password} = req.body;
      const result = await User.createUser(email, password);

      const token = await auth.addUserToSession(result);

      res.set('X-Auth-Token', token);

      res.status(201).json(token);
    } catch (e) {
      console.error(e);
      // duplicate key
      if (e.code === 11000) {
        return res.status(400).json({errors: ['This user already exist']});
      }
      return res.status(500).json({errors: e.message});
    }
  },

  async loginUser(req, res) {
    const {email, password} = req.body;
    // if user have a token, we don't need authorization again
    const check = await auth.checkAuth(req);
    if (check) {
      return res.status(400).json({errors: ['You are authorized']});
    }

    const result = await auth.authorized(email, password);

    if (!result.token) {
      return res.status(400).json({errors: result.errors});
    }

    res.set('X-Auth-Token', result.token);

    res.status(200).json(result.token);
  },

  async createRole(req, res) {
    try {
      const userId = req.session.id_user;
      const roleToSave = req.body;
      const isDuplicate = await Role.checkDuplicate(roleToSave.name, userId);

      if (isDuplicate) {
        return res.status(400).json({errors: ['This role already exists']});
      }

      const role = await Role.createRole({...roleToSave, id_user: userId});
      await User.setRoleToUser(userId, role.id);

      res.status(201).json(role);
    } catch (e) {
      return res.status(400).json({errors: e});
    }
  },

  async deleteRole(req, res) {
    try {
      const userId = req.session.id_user;
      const role = await Role.deleteRole(req.params.id);
      await User.deleteRoleFromUser(userId, role.id);

      res.status(200).json(role);
    } catch (e) {
      return res.status(400).json({errors: e});
    }
  },

  async getAllUserRoles(req, res) {
    try {
      const userId = req.session.id_user;
      const userRoles = await Role.getAllUserRoles(userId);

      res.status(200).json(userRoles);
    } catch (e) {
      return res.status(400).json({errors: e});
    }
  },
  
  async logout(req, res) {
    try {
      const id = req.session.id_session;
      const result = await User.deleteSession(id);
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
    }
  },
};
