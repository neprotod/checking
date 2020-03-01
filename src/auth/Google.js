const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const User = require('../components/user/model');
const AuthInterface = require('./interface/AuthInterface');

const config = require('../../config');

class Google extends AuthInterface {
  /**
   * Authorized user
   *
   * @param {{}} user
   * @return {{}} token or errors
   */
  async authorized(user) {
    const result = {
      errors: [],
      token: '',
    };
    
    const token = await this._saveSignature(user);
    if (!token) {
      result.errors.push({token: 'Something wrong'});
      return result;
    }

    result.token = token;
    return result;
  }
}

module.exports = Google;
