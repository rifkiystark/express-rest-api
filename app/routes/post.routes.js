module.exports = (app) => {
  const authMiddleware = require("../middleware/auth.middleware");
  const postController = require("../controllers/post.controller");
  const postMiddleware = require("../middleware/post.middleware");
  var router = require("express").Router();

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

  app.use("/post", router);
};
