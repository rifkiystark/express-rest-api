const jwt = require("jsonwebtoken");
const db = require("../models");
const SessionToken = db.sessionToken;

exports.validateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401).json({ message: "Authorization not found" });
  }
  try {
    const sessionToken = await SessionToken.findOne({ token: token });
    if (!sessionToken) {
      throw Error("token expired");
    }
    const user = jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      next();
    } else {
      res.send({ message: "Not authorized" });
    }
  } catch (err) {
    res.status(402).send({
      status: "failed",
      message: err.message,
    });
  }
};
