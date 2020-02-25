const Date = require('./Date');

class MatchAdapter {
  constructor(sort) {
    // upper first letter
    this.action =
      'action' +
      sort
        .toLowerCase()
        .charAt(0)
        .toUpperCase() +
      sort.slice(1);
  }

  getMatch() {
    try {
      const action = this.action;
      return this[action]();
    } catch (err) {
      return false;
    }
  }

  actionToday() {
    const currentDay = Date.getDate();
    const endDay = Date.getDate(-1);

    return {start_date: {$gt: currentDay, $lte: endDay}};
  }

  actionWeek() {
    const endWeek = Date.getDate(7);
    const currentDate = new Date();

    return {start_date: {$gt: currentDate, $lte: endWeek}};
  }

  actionBurned() {
    const burnedDate = Date.getDate(1);
    return {start_date: {$gt: burnedDate}};
  }

  actionDone() {
    return {done: true};
  }
}

module.exports = MatchAdapter;
