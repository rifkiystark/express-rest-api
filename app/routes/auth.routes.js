module.exports = (app) => {
  const auth = require("../controllers/auth.controller");
  const { validate } = require("../middleware/tutorial.middleware");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/register", auth.register);
  router.get("/verify/:id", auth.verify);
  router.post("/login", auth.login);
  router.post("/me", auth.me);

  app.use("/auth", router);
};
