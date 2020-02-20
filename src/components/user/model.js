const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
    unique: true,
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
   * Create user in db
   *
   * @param {String} email user email
   * @param {String} password bcrypt hex
   * @return {{}} created result in db
   *
   */
  async createUser(email, password) {
    const user = new User(email, password);
    const result = await user.save();
    return result;
  },
  /**
   * Update user in db
   *
   * @param {String} id
   * @param {{}} data data which must update
   * @return {{}} updated result in db
   *
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
   *
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
   * @return {{}} finded role
   *
   */
  async getRole(id) {
    const result = await Role.findById(id);
    return result;
  },
  /**
   * Find and delete role by id in db
   *
   * @param {String} id
   *
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
   *
   */
  async createSession(data) {
    const session = new Session(data);
    const result = await session.save();
    return result;
  },
  /**
   * Find session by id in db
   *
   * @param {String} id
   * @return {{}} finded session
   *
   */
  async getSession(id) {
    const result = await Session.findById(id);
    return result;
  },
  /**
   * Find and delete session by id in db
   *
   * @param {String} id
   *
   */
  async deleteSession(id) {
    const result = await Session.findByIdAndDelete(id);
    return result;
  },
};
