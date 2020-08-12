const authMiddleware = require("../middleware/auth.middleware");
const commentController = require("../controllers/comment.controller");
const commentMiddleware = require("../middleware/comment.middleware");
const router = require("express").Router();
const commentRoutes = require("express").Router();

// Create a new Tutorial
router.post(
  "/",
  authMiddleware.validateToken,
  commentMiddleware.validatePost,
  commentController.post
);

router.delete(
  "/",
  authMiddleware.validateToken,
  commentMiddleware.validateDelete,
  commentController.delete
);

router.get(
  "/",
  authMiddleware.validateToken,
  commentMiddleware.validateGet,
  commentController.get
);

commentRoutes.use("/comment", router);

module.exports = { commentRoutes };
