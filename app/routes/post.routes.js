const authMiddleware = require("../middleware/auth.middleware");
const postController = require("../controllers/post.controller");
const postMiddleware = require("../middleware/post.middleware");
const router = require("express").Router();
const postRoutes = require("express").Router();

// Create a new Tutorial
router.post(
  "/",
  authMiddleware.validateToken,
  postMiddleware.validateImage,
  postController.post
);

router.patch(
  "/",
  authMiddleware.validateToken,
  postMiddleware.validateUpdate,
  postController.edit
);

router.delete(
  "/",
  authMiddleware.validateToken,
  postMiddleware.validateDelete,
  postController.delete
);

router.get("/me", authMiddleware.validateToken, postController.getAllMyPost);
router.get("/:index", authMiddleware.validateToken, postController.getAll);
router.get("/", authMiddleware.validateToken, postController.getAll);

postRoutes.use("/post", router);

module.exports = { postRoutes };
