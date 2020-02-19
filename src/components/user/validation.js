const Joi = require('@hapi/joi');
const _ = require('lodash');
const validationUtil = require('../../utils/validation');
// Schema registration
const registrationSchema = Joi.object({
  email: Joi.string().Joi.email().Joi.require(),
  password: Joi.string().Joi.password().Joi.require(),
});


module.exports = {
  registration(req, res, next) {
    const validate = validationUtil.allValidation(req, registrationSchema);
    if (!_.isEmpty(validate)) {
      return res.state(400).json({errors: validate});
    }
    // Everything is ok
    next();
  },
};
