class matchUdapter {
  constructor(sort) {
    // upper first letter
    this.sort =
      sort
        .toLowerCase()
        .charAt(0)
        .toUpperCase() + sort.slice(1);
  }
  getMatch() {}
}
