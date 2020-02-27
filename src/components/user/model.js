/* eslint-disable camelcase */
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('../../../config');

const {Schema} = mongoose;

const userSchema = Schema({
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: {unique: true, dropDups: true},
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user_roles',
    },
  ],
  googleId: {
    type: String,
    unique: true,
  },
});

userSchema.plugin(findOrCreate);

const rolesSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const sessionSchema = Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
    index: {
      unique: true,
    },
  },
  session_id: {
    type: String,
  },
  expire: {
    type: Date,
  },
  store: {
    type: Object,
  },
});

const User = mongoose.model('users', userSchema);

const Role = mongoose.model('user_roles', rolesSchema);

const Session = mongoose.model('sessions', sessionSchema);

module.exports = {
  async getTasksRoles(tasks) {
    return await Role.populate(tasks, {
      path: 'tasks.role',
    });
  },

  /**
   * Find user by id
   *
   * @param {String} id user id
   * @return {{}} found user in db
   */
  async getUserById(id) {
    const user = await User.findById(id);
    return user;
  },

  /**
   * Find user by email
   *
   * @param {*} email user email
   * @return {{}} found user in db
   */
  async getUserByEmail(email) {
    const user = await User.findOne({email});
    return user;
  },

  /**
   * Create user in db
   *
   * @param {String} email user email
   * @param {String} password bcrypt hex
   * @return {{}} created user in db
   */
  async createUser(email, password) {
    password = await bcrypt.hash(password, config.saltRound);
    const newUser = new User({email, password});
    const user = await newUser.save();
    return user;
  },

  /**
   * Update user in db
   *
   * @param {String} id user id
   * @param {{}} data data which must update
   * @return {{}} updated result in db
   */
  async updateUser(id, data) {
    const updatedUser = await User.findOneAndUpdate({_id: id}, data, {
      new: true,
    });
    return updatedUser;
  },

  /**
   * Create role in db
   *
   * @param {{}} data role name
   * @return {{}} created role in db
   */
  async createRole(data) {
    const newRole = new Role(data);
    const role = await newRole.save();
    return role;
  },

  /**
   * Find and delete role by id in db
   *
   * @param {String} roleId role id
   * @return {{}} deleted role from db
   */
  async deleteRole(roleId) {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    return deletedRole;
  },

  /**
   * Find all user roles by user id
   *
   * @param {String} userId user id
   * @return {{}} found all user roles
   */
  async getAllUserRoles(userId) {
    const userRoles = await Role.find({id_user: userId});
    return userRoles;
  },

  /**
   * Check role name for duplicate
   *
   * @param {String} roleName role name
   * @param {String} userId user id
   * @return {{}} found all user roles
   */
  async checkDuplicate(roleName, userId) {
    const userRoles = await this.getAllUserRoles(userId);
    const isDuplicate = userRoles.some(role => role.name === roleName);
    return isDuplicate;
  },

  /**
   * Find user by id in db and add role id
   *
   * @param {String} userId user id
   * @param {String} roleId role id
   * @return {{}} updated user
   */
  async setRoleToUser(userId, roleId) {
    const user = await this.getUserById(userId);
    user.roles.push(roleId);
    const updatedUser = await user.save();
    return updatedUser;
  },

  /**
   * Find user by id in db and delete role by id
   *
   * @param {String} userId user id
   * @param {String} roleId role id
   * @return {{}} updated user
   */
  async deleteRoleFromUser(userId, roleId) {
    const user = await this.getUserById(userId);
    const updatedRoles = user.roles.filter(role => role.toString() !== roleId);
    user.roles = updatedRoles;
    const updatedUser = await user.save();
    return updatedUser;
  },

  /**
   * Create session in db
   *
   * @param {{}} data session object
   * @return {{}} created result in db
   */
  async createSession(data) {
    const session = new Session(data);
    const result = await session.save();
    return result;
  },

  /**
   * Find session by id in db
   *
   * @param {String} session_id session_id
   * @return {{}} found a session
   */
  async getSession(session_id) {
    const result = await Session.aggregate([
      {
        $match: {session_id},
      },
      {
        $lookup: {
          from: 'users',
          localField: 'id_user',
          foreignField: '_id',
          as: 'user',
        },
      },
    ]);

    return _.first(result);
  },

  /**
   * Find and delete session by id in db
   *
   * @param {String} session_id
   */
  async deleteSession(session_id) {
    const session = await Session.findOne({session_id});
    session.session_id = null;
    return await session.save();
  },

  /**
   * update session
   *
   * @param {String} id_user
   * @param {String} session_id
   * @return {Boolean}
   */
  async updateSessionId(id_user, session_id) {
    const session = await Session.findOne({id_user});
    session.session_id = session_id;
    await session.save();
    return true;
  },
  User,
};
