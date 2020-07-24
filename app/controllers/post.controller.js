const db = require("../models");
const User = db.user;
const Post = db.post;
const Like = db.like;
const jwt = require("jsonwebtoken");
const auth = require("../helper/auth");
const base = require("../helper/baseurl");

exports.post = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  const userSession = jwt.verify(token, process.env.JWT_TOKEN);
  try {
    const dataUser = await User.findOne({ username: userSession.username });
    const image = req.files.image;
    const extension = image.name.split(".")[image.name.split(".").length - 1];
    const fileName = `${dataUser._id}${Date.now()}.${extension}`;
    image.mv(`./uploads/${fileName}`);
    const post = new Post({
      imgsrc: fileName,
      caption: req.body.caption,
      user_id: dataUser._id,
    });

    const postData = await post.save();
    //send response
    if (postData) {
      res.send({
        status: true,
        message: "File is uploaded",
        data: postData,
      });
    }
  } catch (err) {
    res.status(500).send({ status: "failed", message: err.message });
  }
};

exports.edit = async (req, res) => {
  const { caption, id } = req.body;
  const user = await auth.getUserByToken(req);
  const filter = { user_id: user._id, _id: id };
  const dataUpdate = { caption: caption ? caption : "" };

  try {
    const post = await Post.findOneAndUpdate(filter, dataUpdate);
    if (post) {
      res.send({ status: true, message: "berhasil update" });
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

exports.delete = async (req, res) => {
  const { id } = req.body;
  const user = await auth.getUserByToken(req);
  const filter = { user_id: user._id, _id: id };

  try {
    const post = await Post.findOneAndDelete(filter);
    if (post) {
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
    const user = await auth.getUserByToken(req);
    const posts = await Post.find({}, "-__v", { sort: { createdAt: -1 } })
      .populate("user_id", "fullname -_id", "user")
      .lean();

    await Promise.all(
      posts.map(async (post) => {
        let likes = await Like.find({
          post_id: post._id,
        });
        post.isLiked = likes.some(
          (like) => like.user_id.toString() == user._id.toString()
        );
        post.totalLike = likes.length;
        post.imgsrc = `${base.url}/image/${post.imgsrc}`;
      })
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
