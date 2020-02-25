module.exports = {
  getDate(changeDay = 0) {
    const today = new Date();
    let dd = today.getDate() + changeDay;
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    const result = mm + '/' + dd + '/' + yyyy;

    return Date.parse(result);
  },
};
