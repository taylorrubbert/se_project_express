const User = require("../models/user");
const { error500, error404, error400 } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUserByID = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "error404") {
        return res.status(error404).send({ message: err.message });
      }
      if (err.name === "error400") {
        return res.status(error400).send({ message: "Invalid data" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(error400).send({ message: "Invalid data" });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, getUserByID, createUser };
