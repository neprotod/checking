const Custom = require('./Custom');
const Google = require('./Google');

// All auth class
const drivers = {
  custom: Custom,
  google: Google,
};

/**
 * This function gives the driver to work with auth
 *
 * @param {String} type how driver we need
 * @return {{}} return abstraction auth driver
 */
const getAuthDriver = (type) => {
  if (!drivers[type]) {
    throw new Error(`Doesn't have type ${type}`);
  }

  // If we have the driver create a new instance
  return new drivers[type];
};
module.exports = getAuthDriver;
