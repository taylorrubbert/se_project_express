const ClothingItem = require("../models/clothingItem");
const { error500, error404, error400 } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(error400).send({ message: err.message });
      }
      return res
        .status(error500)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "error400") {
        return res.status(error400).send({ message: err.message });
      }
      if (err.name === "error404") {
        return res.status(error404).send({ message: err.message });
      }
      return res
        .status(error500)
        .send({ message: "An error has ocurred to the server" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
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
        .send({ message: "An error has occurred on the server" });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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
        .send({ message: "An error has occurred on the server" });
    });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
