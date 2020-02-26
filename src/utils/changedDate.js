module.exports = {
  /**
   * This function returns current date with day changes in param
   *
   * @param {Number} days number of days to change the date
   * @return {Number} undefined - ok all error messages
   */
  getDate(days = 0) {
    const date = new Date();
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return Date.parse(copy);
  },
};
