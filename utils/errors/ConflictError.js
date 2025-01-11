class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = error409;
  }
}

module.exports = { ConflictError };
