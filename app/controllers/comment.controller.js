const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const jwt = require("jsonwebtoken");
const auth = require("../helper/auth");

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

exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find({}, {}, { sort: { createdAt: -1 } }).populate(
      "user_id",
      "fullname email",
      "user"
    );
    res.send({
      status: true,
      message: "Get all post data",
      data: posts,
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.getAllMyPost = async (req, res) => {
  try {
    const user = await auth.getUserByToken(req);
    const posts = await Post.find(
      { user_id: user._id },
      {},
      { sort: { createdAt: -1 } }
    ).populate("user_id", "fullname email", "user");
    res.send({
      status: true,
      message: "Get all post data by token",
      data: posts,
    });
  } catch (err) {
    res.send(err.message);
  }
};
