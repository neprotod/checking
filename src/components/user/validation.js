const Joi = require('@hapi/joi');
const _ = require('lodash');
const validationUtil = require('../../utils/validation');
// Schema registration
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(20).required(),
});


module.exports = {
  registration(req, res, next) {
    const validate = validationUtil.allValidation(req, registrationSchema);
    if (!_.isEmpty(validate)) {
      return res.status(400).json({errors: validate});
    }
    // Everything is ok
    next();
  },
};
