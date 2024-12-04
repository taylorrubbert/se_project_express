const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { error401 } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(error401).send({ message: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(error401).send({ message: "Unauthorized" });
  }
};

module.exports = auth;
