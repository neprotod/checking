const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash');
const validationUtil = require('../../utils/validation');

const createTaskSchema = Joi.object({
  role: Joi.objectId().required(),
  priority: Joi.objectId().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  done: Joi.boolean().required(),
});

const updateTaskSchema = Joi.object({
  role: Joi.string(),
  priority: Joi.string(),
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
