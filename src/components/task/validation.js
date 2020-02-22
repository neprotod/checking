const Joi = require('@hapi/joi');
const _ = require('lodash');
const validationUtil = require('../../utils/validation');

const createTaskSchema = Joi.object({
  title: Joi.string().Joi.require(),
  description: Joi.string().Joi.require(),
  start_date: Joi.string().Joi.require(),
  end_date: Joi.string().Joi.require(),
  done: Joi.boolean().Joi.require(),
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
};
