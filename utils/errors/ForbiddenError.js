class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = error403;
  }
}

module.exports = { ForbiddenError };
