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
  type: {
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
  /**
   * Find user by email
   *
   * @param {*} email
   * @return {{}}
   */
  async getUserByEmail(email) {
    const result = await User.findOne({email});
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
    const result = await User.findOneAndUpdate(id, data);
    return result;
  },
  /**
   * Create role in db
   *
   * @param {String} name role name
   * @param {String} type role type
   * @return {{}} created result in db
   */
  async createRole(name, type) {
    const role = new Role(name, type);
    const result = await role.save();
    return result;
  },
  /**
   * Find role by id in db
   *
   * @param {String} id
   * @return {{}} found a role
   */
  async getRole(id) {
    const result = await Role.findById(id);
    return result;
  },
  /**
   * Find and delete role by id in db
   *
   * @param {String} id
   */
  async deleteRole(id) {
    const result = await Role.findByIdAndDelete(id);
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
};
