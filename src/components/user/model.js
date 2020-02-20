const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'user_roles' }],
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
  },
  session_id: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    required: true,
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
   *
   * @param {*} data
   */
  async createUser(data) {
    const user = new User(data);
    const result = await user.save();
    return result;
  },
  async createRole(data) {
    const role = new Role(data);
    const result = await role.save();
    return result;
  },
  async getRole(id) {
    const result = await Role.findById(id);
    return result;
  },
  async deleteRole(id) {
    const result = await Role.findByIdAndDelete(id);
    return result;
  },
  async createSession(data) {
    const session = new Session(data);
    const result = await session.save();
    return result;
  },
  async getSession(id) {
    const result = await Session.findById(id);
    return result;
  },
  async deleteSession(id) {
    const result = await Session.findByIdAndDelete(id);
    return result;
  },
};
