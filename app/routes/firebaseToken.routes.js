const firebaseTokenMiddleware = require("../middleware/firebaseToken.middleware");
const firebaseTokenController = require("../controllers/firebaseToken.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = require("express").Router();
const firebaseRoutes = require("express").Router();

// Create a new Tutorial
router.post(
  "/",
  authMiddleware.validateToken,
  firebaseTokenMiddleware.validateToken,
  firebaseTokenController.registerToken
);

firebaseRoutes.use("/registertoken", router);

module.exports = { firebaseRoutes };
