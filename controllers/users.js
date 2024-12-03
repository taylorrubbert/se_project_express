const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  error500,
  error404,
  error400,
  error401,
  error409,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFound") {
        return res.status(error404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(error400).send({ message: "Invalid data" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(error400)
      .send({ message: "Email and password are required" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      res.send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(error400).send({ message: "Invalid data" });
      }
      if (err.code === 11000) {
        return res.status(error409).send({ message: "User already exists" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(error400)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "UnauthorizedError") {
        return res.status(error401).send({ message: "Unauthorized" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then(() => res.status(200).send({ name, avatar }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(error400).send({ message: "Bad request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(error404).send({ message: "Page not found" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getCurrentUser, login, updateUser, createUser };
