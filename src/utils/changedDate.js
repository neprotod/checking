module.exports = {
  /**
   * This function returns current date with day changes in param
   *
   * @param {Number} days number of days to change the date
   * @return {Number} parse date
   */
  getDate(days = 0) {
    const date = new Date();
    const copy = new Date(Number(date));

    copy.setDate(date.getDate() + days);

    return Date.parse(copy);
  },

  /**
   * This function returns start date in the month with month changes in param
   *
   * @param {Number} month number of month to change in the date
   * @return {Number} parse date
   */
  getStartMonth(month = 0) {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + month,
      1,
    );

    return Date.parse(date);
  },

  /**
   * This function returns start date in the year with year changes in param
   *
   * @param {Number} year number of year to change in the date
   * @return {Number} parse date
   */
  getStartYear(year = 0) {
    const date = new Date(new Date().getFullYear() + year, 0, 1);

    return Date.parse(date);
  },
};
