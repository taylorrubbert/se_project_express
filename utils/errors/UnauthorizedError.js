class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = error401;
  }
}

module.exports = { UnauthorizedError };
