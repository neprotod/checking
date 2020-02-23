const auth = require('../auth')('custom');

module.exports = {
  async checkAuth(req, res, next) {
    const check = await auth.checkAuth(req);
    if (!check) {
      return res.status(400).json({errors: 'Session expire'});
    }

    return next();
  },
};
