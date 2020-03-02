const changedDate = require('./changedDate');

class MatchAdapter {
  /**
   *Create adapter for match
   *
   * @param {String} sort filter tasks param
   */
  constructor(filter) {
    // upper first letter
    this.action =
      'action' +
      filter
        .toLowerCase()
        .charAt(0)
        .toUpperCase() +
      filter.slice(1);
  }

  /**
   *Get the match by filter
   *
   * @return {{}} return match
   */
  getMatch() {
    try {
      const action = this.action;
      return this[action]();
    } catch (err) {
      return false;
    }
  }

  /**
   *Get today filter
   *
   * @return {{}} return today filter
   */
  actionToday() {
    const currentDay = changedDate.getDate();
    const endDay = changedDate.getDate(1);

    return {start_date: {$gt: currentDay, $lte: endDay}};
  }

  /**
   *Get tomorrow filter
   *
   * @return {{}} return tomorrow filter
   */
  actionTomorrow() {
    const currentDay = changedDate.getDate(1);
    const endDay = changedDate.getDate(2);

    return {start_date: {$gt: currentDay, $lte: endDay}};
  }

  /**
   *Get week filter
   *
   * @return {{}} return week filter
   */
  actionWeek() {
    const endWeek = changedDate.getDate(7);
    const currentDate = changedDate.getDate();

    return {start_date: {$gt: currentDate, $lte: endWeek}};
  }

  /**
   *Get after week filter
   *
   * @return {{}} return after week filter
   */
  actionAfterweek() {
    const startWeek = changedDate.getDate(7);

    return {start_date: {$gt: startWeek}};
  }

  /**
   *Get burned filter
   *
   * @return {{}} return burned filter
   */
  actionBurned() {
    const burnedDate = changedDate.getDate();
    return {end_date: {$lte: burnedDate}};
  }

  /**
   *Get done filter
   *
   * @return {{}} return done filter
   */
  actionDone() {
    return {done: true};
  }

  /**
   *Get match without filter (all tasks)
   *
   * @return {{}} return match without filter
   */
  actionAll() {
    return {};
  }
}

module.exports = MatchAdapter;
