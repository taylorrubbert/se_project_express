class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = error404;
  }
}

module.exports = { NotFoundError };