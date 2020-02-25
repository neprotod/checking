module.exports = {
  getDate(days = 0) {
    const date = new Date();
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return Date.parse(copy);
  },
};
