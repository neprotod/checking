const auth = require('../auth')('custom');

module.exports = {
  async checkAuth(req, res, next) {
    try{
      const check = await auth.checkAuth(req);
      if (!check) {
        return res.status(400).json({errors: 'Session expire'});
      }

      return next();
    }catch(e){
      console.error(e);
      res.status(400).json({errors: 'Session token is not valid'});
    }
    
  },
};
