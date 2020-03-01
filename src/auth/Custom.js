const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const User = require('../components/user/model');
const AuthInterface = require('./interface/AuthInterface');

const config = require('../../config');
/**
 * Custom authorization
 */
class Custom extends AuthInterface {
  /**
   * Authorized user
   *
   * @param {String} email
   * @param {String} password
   * @return {{}} token or errors
   */
  async authorized(email, password) {
    const result = {
      errors: [],
      token: '',
    };

    const user = await User.getUserByEmail(email);

    if (!user) {
      result.errors.push({user: "Don't find user"});
      return result;
    }

    // test password
    const test = await bcrypt.compare(password, user.password);
    if (!test) {
      result.errors.push({password: "Don't find user"});
      return result;
    }

    const token = await this._saveSignature(user);
    if (!token) {
      result.errors.push({token: 'Something wrong'});
      return result;
    }

    result.token = token;
    return result;
  }
}

module.exports = Custom;
