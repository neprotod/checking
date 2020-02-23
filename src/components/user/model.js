/* eslint-disable camelcase */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('../../../config');

const {Schema} = mongoose;

const userSchema = Schema({
  password: {
    type: String,
    required: true,
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
});

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
    required: true,
    index: {
      unique: true,
    },
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
  /**
   * Find user by id
   *
   * @param {String} id user id
   * @return {{}} found user in db
   */
  async getUserById(id) {
    const result = await User.findById(id);
    return result;
  },
  /**
   * Find user by email
   *
   * @param {*} email user email
   * @return {{}} found user in db
   */
  async getUserByEmail(email) {
    const result = await User.findOne({email});
    return result;
  },
  /**
   * Find user by email
   *
   * @param {String} email user email
   * @param {String} password user password
   * @return {{}} found user in db
   */
  async getUserByEmailAndPassword(email, password) {
    const result = await User.findOne({email, password});
    return result;
  },
  /**
   * Create user in db
   *
   * @param {String} email user email
   * @param {String} password bcrypt hex
   * @return {{}} created result in db
   */
  async createUser(email, password) {
    password = await bcrypt.hash(password, config.saltRound);
    const user = new User({email, password});
    const result = await user.save();
    return result;
  },
  /**
   * Update user in db
   *
   * @param {String} id
   * @param {{}} data data which must update
   * @return {{}} updated result in db
   */
  async updateUser(id, data) {
    const result = await User.findOneAndUpdate({_id: id}, data, {new: true});
    return result;
  },
  /**
   * Create role in db
   *
   * @param {{}} data role name
   * @return {{}} created role in db
   */
  async createRole(data) {
    const role = new Role(data);
    const result = await role.save();
    return result;
  },
  /**
   * Find and delete role by id in db
   *
   * @param {String} id role id
   * @return {{}} deleted role from db
   */
  async deleteRole(id) {
    const result = await Role.findByIdAndDelete(id);
    return result;
  },
  /**
   * Find all roles in db
   *
   * @return {{}} found all roles
   */
  async getAllRoles() {
    const result = await Role.find();
    return result;
  },
  /**
   * Find all user roles by user id
   * @param {String} userId user id
   * @return {{}} found all user roles
   */
  async getAllUserRoles(userId) {
    const allRoles = await this.getAllRoles();
    const result = allRoles.filter(
      role => role.id_user.toString() === userId.toString(),
    );
    return result;
  },
  /**
   * Check role name for duplicate
   *
   * @param {String} roleName role name
   * @param {String} userId user id
   * @return {{}} found all user roles
   */
  async checkDuplicate(roleName, userId) {
    const allRoles = await this.getAllRoles();
    const result = allRoles.some(
      role =>
        role.id_user.toString() === userId.toString() && role.name === roleName,
    );
    return result;
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
    const updatedRoles = [...user.roles, roleId];
    const result = await this.updateUser(userId, {roles: updatedRoles});
    return result;
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
    const updatedRoles = user.roles.filter(role => role !== roleId);
    const result = await this.updateUser(userId, {roles: updatedRoles});
    return result;
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
    // const result = await Session.find({session_id});
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
    await session.save();
    return true;
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
};
