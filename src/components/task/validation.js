const Joi = require('@hapi/joi');
const _ = require('lodash');
const validationUtil = require('../../utils/validation');

const createTaskSchema = Joi.object({
  title: Joi.string().require(),
  description: Joi.string().require(),
  start_date: Joi.string().require(),
  end_date: Joi.string().require(),
  done: Joi.boolean().require(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  start_date: Joi.string(),
  end_date: Joi.string(),
  done: Joi.boolean(),
});

module.exports = {
  createTask(req, res, next) {
    const validate = validationUtil.allValidation(req, createTaskSchema);

    if (!_.isEmpty(validate)) {
      return res.state(400).json({errors: validate});
    }
    next();
  },

  updateTask(req, res, next) {
    const validate = validationUtil.allValidation(req, updateTaskSchema);

    if (!_.isEmpty(validate)) {
      return res.state(400).json({errors: validate});
    }
    next();
  },
};
