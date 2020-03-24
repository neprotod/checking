const _ = require('lodash');
const config = require('../../../config.js');
const User = require('./model');
const authDriver = require('../../auth');
const Role = require('./model');
const TaskModel = require('../task/model');
const {mail} = require('../../auth/confirmEmail');

module.exports = {
  async registerUser(req, res) {
    const auth = authDriver('custom');
    try {
      const {email, password} = req.body;
      const checkUser = await User.getUserByEmail(email);

      if (!_.isEmpty(checkUser)) throw new Error('This user already exist');

      const result = await User.createUser(email, password);

      const token = await auth.addUserToSession(result);

      mail(email).catch(console.error);

      res.set('X-Auth-Token', token);

      res.status(201).json(token);
    } catch (e) {
      console.error(e);
      // duplicate key
      if (e.code === 11000) {
        return res.status(400).json({errors: ['This user already exists']});
      }
      return res.status(500).json({errors: e.message});
    }
  },

  async loginGoogle(req, res) {
    const auth = authDriver('google');
    const user = req.user;
    const {_id} = user;

    try {
      // if user have a token, we don't need authorization again
      const check = await auth.checkAuth(req);
      if (check) {
        return res.status(400).json({errors: ['You are authorized']});
      }

      const checkUser = await User.getSessionByUserId(_id);

      let token = '';
      if (_.isEmpty(checkUser)) {
        token = await auth.addUserToSession(user);
      } else {
        const result = await auth.authorized(user);
        token = result.token;
      }

      res.set('X-Auth-Token', token);

      return res
        .status(301)
        .redirect(`${config.to_login}?token=${encodeURIComponent(token)}`);
    } catch (e) {
      console.error(e);
      return res.status(400).json({errors: e.message});
    }
  },

  async loginUser(req, res) {
    const auth = authDriver('custom');
    const {email, password} = req.body;
    try {
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
    } catch (e) {
      return res.status(400).json({errors: e.message});
    }
  },

  async createRole(req, res) {
    try {
      const userId = req.session.id_user;
      const roleToSave = req.body;
      const isDuplicate = await Role.checkRoleDuplicate(
        roleToSave.name,
        userId,
      );

      if (isDuplicate) {
        return res.status(400).json({errors: ['This role already exists']});
      }

      const role = await Role.createRole({...roleToSave, id_user: userId});
      await User.setRoleToUser(userId, role.id);

      res.status(201).json(role);
    } catch (e) {
      return res.status(400).json({errors: e.message});
    }
  },

  async deleteRole(req, res) {
    try {
      const userId = req.session.id_user;
      const roleId = req.params.id;

      const tasks = await TaskModel.getTasksByRole(userId, roleId);

      if (tasks.length > 0) {
        return res.status(409).json({errors: 'Role has tasks'});
      }

      const deletedRole = await Role.deleteRole(roleId);
      await User.deleteRoleFromUser(userId, roleId);

      res.status(200).json(deletedRole);
    } catch (e) {
      return res.status(400).json({errors: e});
    }
  },

  async updateRole(req, res) {
    try {
      const roleId = req.params.id;
      const dataToUpdate = req.body;
      const updatedRole = await Role.updateRole(roleId, dataToUpdate);

      res.status(200).json(updatedRole);
    } catch (e) {
      return res.status(400).json({errors: e.message});
    }
  },

  async getAllUserRoles(req, res) {
    try {
      const userId = req.session.id_user;
      const userRoles = await Role.getAllUserRoles(userId);

      res.status(200).json(userRoles);
    } catch (e) {
      return res.status(400).json({errors: e.message});
    }
  },

  async logout(req, res) {
    try {
      const id = req.session.id_session;
      const result = await User.deleteSession(id);
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      return res.status(400).json({errors: e.message});
    }
  },
};
