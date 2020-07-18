module.exports = (app) => {
  const auth = require("../controllers/auth.controller");
  const userMiddleware = require("../middleware/user.middleware");
  const authValidator = require("../middleware/auth.middleware");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/register", userMiddleware.validateRegister, auth.register);
  router.get("/verify/:id", auth.verify);
  router.post("/login", userMiddleware.validateLogin, auth.login);
  router.post("/me", authValidator.validateToken, auth.me);

  app.use("/auth", router);
};
