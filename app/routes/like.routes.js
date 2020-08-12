const authMiddleware = require("../middleware/auth.middleware");
const likeController = require("../controllers/like.controller");
const likeMiddleware = require("../middleware/like.middleware");
const router = require("express").Router();
const likeRoutes = require("express").Router();

// Create a new Tutorial
router.post(
  "/",
  authMiddleware.validateToken,
  likeMiddleware.validatePost,
  likeController.post
);

router.delete(
  "/",
  authMiddleware.validateToken,
  likeMiddleware.validateDelete,
  likeController.delete
);

likeRoutes.use("/like", router);

module.exports = { likeRoutes };
