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
   * Add user to session
   *
   * @param {{}} user
   * @return {String} jwt signature
   */
  async addUserToSession(user) {
    const sessionId = uuid();
    const toSession = {
      id_user: user._id,
      session_id: sessionId,
      store: {},
    };

    const optionalJWT = {};
    if (config.expire) {
      toSession.expire = config.expire;
      optionalJWT.expiresIn = config.expire;
    }

    await User.createSession(toSession);

    // Create JWT
    return await jwt.sign({id: sessionId}, config.jwt_secret, optionalJWT);
  }

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

  /**
   * Set session id to session collection
   *
   * @param {*} user
   * @return {String} jwt signature
   */
  async _saveSignature(user) {
    const sessionId = uuid();

    const optionalJWT = {};
    if (config.expire) {
      optionalJWT.expiresIn = config.expire;
    }

    await User.updateSessionId(user._id, sessionId);

    // Create JWT
    return await jwt.sign({id: sessionId}, config.jwt_secret, optionalJWT);
  }

  /**
   * If we have a bearer token we're trying authorization
   *
   * @param {*} req
   * @return {Boolean} true if authorized
   */
  async checkAuth(req) {
    const auth = req.header('authorization');
    if (!auth) return false;

    const token = auth.split(' ')[1];

    // if session is expire
    const decoded = jwt.verify(token, config.jwt_secret);
    if (!decoded) return false;

    // Test session
    const session = await User.getSession(decoded.id);
    if (!session) {
      console.error("This session doesn't find");
      return false;
    }

    // test expire
    if (session.expire) {
      const testData = new Date(session.expire);
      const nowData = Date.now();
      if (testData >= nowData) {
        console.error('This session expire');
        // Drop session
        await User.deleteSession(decoded.id);
        return false;
      }
    }

    req.session = {
      id_session: decoded.id,
      token,
      id_user: session.id_user,
      user: _.first(session.user),
      store: session.store || [],
    };

    return true;
  }
}

module.exports = Custom;
