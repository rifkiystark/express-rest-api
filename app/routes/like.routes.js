module.exports = (app) => {
  const authMiddleware = require("../middleware/auth.middleware");
  const likeController = require("../controllers/like.controller");
  const likeMiddleware = require("../middleware/like.middleware");
  var router = require("express").Router();

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

  app.use("/like", router);
};
