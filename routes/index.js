const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateLogin,
  validateUserInfo,
} = require("../middlewares/validation");

router.use("/users", auth, userRouter);
router.use("/items", clothingItemRouter);
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserInfo, createUser);
router.use((req, res, next) => {
  next(new NotFoundError("Not found"));
});

module.exports = router;
