/* eslint-disable no-unused-vars */
/**
 * Interface to all authorization class
 */
class AuthInterface {
  /**
   * Add user to session
   *
   * @param {{}} user
   */
  async addUserToSession(user) {
    throw new Error('Abstract method');
  }

  /**
   * If we have a bearer token we're trying authorization
   *
   * @param {*} req all params to authorized
   * @return {Boolean} true if authorized
   */
  async checkAuth(req) {
    throw new Error('Abstract method');
  }
}

module.exports = AuthInterface;
