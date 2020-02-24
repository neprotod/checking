const Joi = require('@hapi/joi');
const _ = require('lodash');
const validationUtil = require('../../utils/validation');

const createTaskSchema = Joi.object({
  role: Joi.string().required(),
  priority: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  done: Joi.boolean().required(),
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
      return res.status(400).json({errors: validate});
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