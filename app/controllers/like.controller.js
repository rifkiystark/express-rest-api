const db = require("../models");
const Like = db.like;
const auth = require("../helper/auth");

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
