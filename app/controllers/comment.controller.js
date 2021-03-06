const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const jwt = require("jsonwebtoken");
const auth = require("../helper/auth");
const FirebaseToken = require("../models/firebaseToken.model");
const { sendNotification } = require("../helper/notification");

exports.post = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  const userSession = jwt.verify(token, process.env.JWT_TOKEN);
  try {
    const dataUser = await User.findOne({ username: userSession.username });

    const comment = new Comment({
      user_id: dataUser._id,
      post_id: req.body.post_id,
      comment: req.body.comment,
    });

    const commentData = await comment.save();
    //send response
    if (commentData) {
      const dataPost = await Post.findById(req.body.post_id);
      const dataToken = await FirebaseToken.find({ user_id: dataPost.user_id });
      const tokens = [];
      dataToken.forEach((token) => {
        tokens.push(token.token);
      });
      const message = `${dataUser.username} berkomentar pada foto anda`;
      sendNotification(tokens, message);

      res.send({
        status: true,
        message: "Comment is uploaded",
        data: commentData,
      });
    }
  } catch (err) {
    res.status(500).send({ status: "failed", message: err.message });
  }
};

exports.delete = async (req, res) => {
  const { comment_id } = req.body;
  const user = await auth.getUserByToken(req);
  const filter = { user_id: user._id, _id: comment_id };

  try {
    const comment = await Comment.findOneAndDelete(filter);
    if (comment) {
      res.send({ status: true, message: "berhasil dihapus" });
    } else {
      res.status(404).send({
        status: false,
        message: "comment with authentication id not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    const { post_id } = req.query;
    const posts = await Comment.find(
      { post_id: post_id },
      "-post_id",
      {}
    ).populate("user_id", "fullname -_id", "user");
    res.send({
      status: true,
      message: "Get all post data",
      data: posts,
    });
  } catch (err) {
    res.send(err.message);
  }
};
