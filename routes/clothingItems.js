const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateCardBody,
  validateItemID,
} = require("../middlewares/validation");

router.post("/", auth, validateCardBody, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validateItemID, deleteItem);
router.put("/:itemId/likes", auth, validateItemID, likeItem);
router.delete("/:itemId/likes", auth, validateItemID, dislikeItem);

module.exports = router;
