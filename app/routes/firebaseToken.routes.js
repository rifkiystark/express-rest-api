module.exports = (app) => {
  const firebaseTokenMiddleware = require("../middleware/firebaseToken.middleware");
  const firebaseTokenController = require("../controllers/firebaseToken.controller");
  const authMiddleware = require("../middleware/auth.middleware");
  var router = require("express").Router();

  // Create a new Tutorial
  router.post(
    "/",
    authMiddleware.validateToken,
    firebaseTokenMiddleware.validateToken,
    firebaseTokenController.registerToken
  );

  app.use("/registertoken", router);
};
