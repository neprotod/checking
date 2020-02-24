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
    // add
    const start = new Date('2020.02.25');
    const end = new Date('2020.02.26');
    return {start_date: {$gt: start, $lte: end}};
  }

  actionBurned() {
    const currentDate = new Date();
    return {end_date: {$gt: currentDate}};
  }

  actionDone() {
    return {done: true};
  }
}

module.exports = MatchAdapter;
// const tasks = await Tasks.find({id_user: userId}).populate({
//   path: 'tasks',
//   match: {done: false, title: 'only odne'},
// });
