module.exports = {
  /**
   * This function returns current date with day changes in param
   *
   * @param {Number} days number of days to change the date
   * @return {Number} parse date
   */
  getDate(days = 0, timeZone = 0) {
    const date = new Date();
    const copy = new Date(Number(date));

    copy.setDate(date.getDate() + days);
    copy.setMinutes(date.getMinutes() + timeZone);

    return Date.parse(copy);
  },

  /**
   * This function returns start of any day from now with params ti change
   *
   * @param {Number} days number of days to change in the date
   * @return {Number} parse date
   */
  getStartDay(days = 0, timeZone = 0, minutes = 0) {
    console.log(timeZone);
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + days,
      0,
      0 + timeZone + minutes,
    );
    console.log(date);
    console.log(timeZone);

    return Date.parse(date);
  },

  /**
   * This function returns start date in the month with month changes in param
   *
   * @param {Number} month number of month to change in the date
   * @return {Number} parse date
   */
  getStartMonth(month = 0, timeZone = 0) {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + month,
      1,
      0,
      0 + timeZone,
    );

    return Date.parse(date);
  },

  /**
   * This function returns start date in the year with year changes in param
   *
   * @param {Number} year number of year to change in the date
   * @return {Number} parse date
   */
  getStartYear(year = 0, timeZone = 0) {
    const date = new Date(
      new Date().getFullYear() + year,
      0,
      1,
      0,
      0 + timeZone,
    );

    return Date.parse(date);
  },
};
