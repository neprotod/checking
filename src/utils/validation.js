module.exports = {
  /**
   * Get all error messages from validation
   *
   * @param  {Object} validation schema from hepi
   * @return {Object} all error messages
   */
  getMessages(validation) {
    if (!validation.error) {
      return false;
    }

    const allMessage = [];

    for (const detail of validation.error.details) {
      allMessage.push(detail.message);
    }

    return allMessage;
  },

  /**
   * This function returns error messages or adds all validation fields
   * to req.body
   *
   * @param {*} req
   * @param {*} schema schema from hepi
   * @param {*} optional object for sup parameters
   * @return {undefined | Array} undefined - ok all error messages
   */
  allValidation(req, schema, optional = {}) {
    const validation = schema.validate(
        req.body,
        {abortEarly: false, ...optional},
    );
    // Get all errors validation
    const errorMessages = this.getMessages(validation);
    if (errorMessages) {
      return errorMessages;
    }

    req.body = validation.value;
    return errorMessages;
  },
};
