const db = require("../models/index");
const FirebaseToken = db.firebaseToken;
const auth = require("../helper/auth");

exports.registerToken = async (req, res) => {
  try {
    const user = await auth.getUserByToken(req);

    const newToken = new FirebaseToken({
      token: req.body.token,
      user_id: user._id,
    });

    const firebaseToken = await newToken.save();
    if (firebaseToken) {
      res.send({
        status: true,
        message: "Registrasi token berhasil",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "server error",
      data: err,
    });
  }
};
