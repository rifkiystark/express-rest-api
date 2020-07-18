const db = require("../models");
const emailer = require("../helper/emailer");
const User = db.user;
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // Create a Tutorial
  const { body } = req;
  const user = new User({
    username: body.username,
    email: body.email,
    password: body.password,
    isVerified: false,
  });
  try {
    const registerData = await user.save(user);
    if (registerData) {
      emailer.send(registerData);
      res.send(registerData);
    }
  } catch (err) {
    res.status(500).json({
      message: err.errors,
    });
  }
};

exports.login = async (req, res) => {
  const { body } = req;

  try {
    const user = await User.findOne({
      username: body.username,
      password: body.password,
    });

    if (user) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.JWT_TOKEN,
        { expiresIn: "30d" }
      );
      res.send({ token: accessToken });
    } else {
      res.status(400).json({
        message: "user tidak ada",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.verify = async (req, res) => {
  // Create a Tutorial

  const filter = {
    _id: req.params.id,
  };
  const dataUpdate = {
    isVerified: true,
  };

  const user = await User.findOneAndUpdate(filter, dataUpdate);
  if (user) {
    res.send(user);
  } else {
    res.status(400).send({ status: "asdasd" });
  }
};

exports.me = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token
  try {
    const user = await jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      const dataUser = await User.findOne({ username: user.username });
      res.send(dataUser);
    } else {
      res.send({ maessage: "not valid" });
    }
  } catch (err) {
    res.send(err);
  }
};
