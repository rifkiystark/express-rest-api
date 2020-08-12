const db = require("../models");
const Like = db.like;
const auth = require("../helper/auth");
const FirebaseToken = require("../models/firebaseToken.model");
const Post = require("../models/post.model");
const { sendNotification } = require("../helper/notification");

exports.post = async (req, res) => {
  try {
    const dataUser = await auth.getUserByToken(req);
    const like = new Like({
      user_id: dataUser._id,
      post_id: req.body.post_id,
    });

    const likeData = await like.save();
    //send response
    if (likeData) {
      const dataPost = await Post.findById(req.body.post_id);
      const dataToken = await FirebaseToken.find({ user_id: dataPost.user_id });
      const tokens = [];
      dataToken.forEach((token) => {
        tokens.push(token.token);
      });
      const message = `${dataUser.username} menyukasi foto anda`;
      sendNotification(tokens, message);
      res.send({
        status: true,
        message: "Liked",
        data: likeData,
      });
    }
  } catch (err) {
    res.status(500).send({ status: "failed", message: err.message });
  }
};

exports.delete = async (req, res) => {
  const { post_id } = req.body;
  const user = await auth.getUserByToken(req);
  const filter = { user_id: user._id, post_id: post_id };

  try {
    const like = await Like.findOneAndDelete(filter);
    if (like) {
      res.send({ status: true, message: "berhasil dihapus" });
    } else {
      res.status(404).send({
        status: false,
        message: "post with authentication id not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};
