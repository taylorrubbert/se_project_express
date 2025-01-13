class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = error400;
  }
}

module.exports = { BadRequestError };