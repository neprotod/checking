/* eslint-disable no-unused-vars */
/**
 * Interface to all authorization class
 */
class AuthInterface {
  /**
   * Add user to session
   *
   * @param {{}} user
   * @return {String} jwt signature
   */
  async addUserToSession(user) {
    throw new Error('Abstract method');
  }

  /**
   * Authorized user
   *
   * @param {String} email
   * @param {String} password
   * @return {{}} token or errors
   */
  async authorized(email, password) {
    throw new Error('Abstract method');
  }

  /**
   * If we have a bearer token we're trying authorization
   *
   * @param {*} req
   * @return {Boolean} true if authorized
   */
  async checkAuth(req) {
    throw new Error('Abstract method');
  }

  /**
   * Set session id to session collection
   *
   * @param {*} user
   * @return {String} jwt signature
   */
  async _saveSignature(user) {
    throw new Error('Abstract method');
  }
}

module.exports = AuthInterface;
