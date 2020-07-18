const jwt = require("jsonwebtoken");

exports.validateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401).json({ message: "Authorization not found" });
  }
  try {
    const user = await jwt.verify(token, process.env.JWT_TOKEN);
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
