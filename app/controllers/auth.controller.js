const db = require("../models");
const emailer = require("../helper/emailer");
const User = db.user;
const SessionToken = db.sessionToken;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getAvatar } = require("../helper/randomAvatar");

exports.register = async (req, res) => {
  // Create a Tutorial
  const { body } = req;

  try {
    const passwordHashed = bcrypt.hashSync(body.password, 10);
    const user = new User({
      username: body.username,
      email: body.email,
      password: passwordHashed,
      fullname: body.fullname,
      isVerified: false,
      profilePicture: getAvatar(),
    });

    const registerData = await user.save(user);
    if (registerData) {
      emailer.send(registerData);
      res.send({
        status: "success",
        message: "User has been registered",
      });
    }
  } catch (err) {
    if (err.errors) {
      let errorMessage = {};
      if (err.errors.email) {
        errorMessage.email = "Email sudah ada";
      }
      if (err.errors.username) {
        errorMessage.username = "Username sudah ada";
      }
      return res.status(400).send({
        status: false,
        message: "Validation error",
        data: errorMessage,
      });
    } else {
      return res.status(500).send({
        status: false,
        message: "Server error",
      });
    }
  }
};

exports.login = async (req, res) => {
  const { body } = req;

  try {
    const user = await User.findOne({
      username: body.username,
    });

    if (user) {
      if (!user.isVerified) {
        return res
          .status(400)
          .send({ status: false, message: "Email belum diverifikasi" });
      }
      if (bcrypt.compareSync(body.password, user.password)) {
        const accessToken = jwt.sign(
          { username: user.username },
          process.env.JWT_TOKEN,
          { expiresIn: "30d" }
        );
        const sessionToken = new SessionToken({ token: accessToken });
        await sessionToken.save();
        return res.send({
          status: true,
          message: "Login berhasil",
          data: {
            token: accessToken,
            type: "Bearer",
          },
        });
      } else {
        return res.status(400).send({
          status: false,
          message: "Password salah",
        });
      }
    } else {
      return res.status(400).send({
        status: false,
        message: "User belum terdaftar",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Server error",
      data: err,
    });
  }
};

exports.verify = async (req, res) => {
  const id = req.params.id;
  const dataUpdate = {
    isVerified: true,
  };
  try {
    const user = await User.findById(id);
    if (user) {
      if (user.isVerified) {
        res.send("<h1>Email sudah terverifikasi</h1>");
      } else {
        await User.findByIdAndUpdate(id, dataUpdate);
        res.send("<h1>Emailmu berhasil diverifikasi</h1>");
      }
    } else {
      res.status(400).send("<h1>Email belum terdaftar</h1>");
    }
  } catch (err) {
    res.status(500).send("<h1>Server Error</h1>");
  }
};

exports.me = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      const dataUser = await User.findOne({ username: user.username });
      res.send({
        status: true,
        message: "Get user detail success",
        data: {
          fullname: dataUser.fullname,
          email: dataUser.email,
          profilePicture: dataUser.profilePicture,
        },
      });
    } else {
      res.status(400).send({ status: false, message: "Token not valid" });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Server error",
      data: err,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    const deleted = await SessionToken.deleteOne({ token: token });
    if (deleted.ok) {
      return res.send({
        status: "success",
        message: "Logout success",
      });
    } else {
      return res.status(402).send({
        status: "failed",
        message: "Logout failed",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Server error",
      data: err,
    });
  }
};
