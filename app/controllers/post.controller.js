const db = require("../models");
const User = db.user;
const Post = db.post;
const jwt = require("jsonwebtoken");
const auth = require("../helper/auth");

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
