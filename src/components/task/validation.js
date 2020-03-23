const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const _ = require('lodash');
const validationUtil = require('../../utils/validation');

const taskSchema = Joi.object({
  role: Joi.alternatives().try(
    Joi.objectId(),
    Joi.string()
      .allow(null)
      .allow(''),
  ),
  priority: Joi.objectId(),
  title: Joi.string(),
  description: Joi.string(),
  start_date: Joi.string(),
  end_date: Joi.string(),
  done: Joi.boolean(),
});

module.exports = {
  createTask(req, res, next) {
    const validate = validationUtil.allValidation(req, taskSchema, {
      presence: 'required',
    });

    if (!_.isEmpty(validate)) {
      return res.status(400).json({errors: validate});
    }

    next();
  },

  updateTask(req, res, next) {
    const validate = validationUtil.allValidation(req, taskSchema);

    if (!_.isEmpty(validate)) {
      return res.state(400).json({errors: validate});
    }
    next();
  },
};
