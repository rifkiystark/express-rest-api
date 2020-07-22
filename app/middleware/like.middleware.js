const Joi = require("@hapi/joi");
const db = require("../models");
const auth = require("../helper/auth");
const Like = db.like;
const Post = db.post;

exports.validatePost = async (req, res, next) => {
  const likeScheme = Joi.object().keys({
    post_id: Joi.string().required(),
  });
  const result = likeScheme.validate(req.body, { abortEarly: false });
  if (result.error) {
    const { details } = result.error;
    let pesan = [];
    details.map((i) => pesan.push({ [i.context.key]: i.message }));
    res.status(400).json({
      message: "Invalid request",
      data: pesan,
    });
  } else {
    try {
      const postData = await Post.findById(req.body.post_id);
      if (postData) {
        const user = await auth.getUserByToken(req);
        const isLiked = await Like.findOne({
          user_id: user._id,
          post_id: postData._id,
        });
        if (isLiked) {
          res.status(200).json({
            status: true,
            message: "Sudah di like",
          });
        } else {
          next();
        }
      } else {
        res.status(400).json({
          message: "Invalid request",
          data: {
            post: "Post data with id not found",
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        data: err.message,
      });
    }
  }
};

exports.validateDelete = (req, res, next) => {
  const likeScheme = Joi.object().keys({
    post_id: Joi.string().required(),
  });
  const result = likeScheme.validate(req.body, { abortEarly: false });
  if (result.error) {
    const { details } = result.error;
    let pesan = [];
    details.map((i) => pesan.push({ [i.context.key]: i.message }));
    res.status(400).json({
      message: "Invalid request",
      data: pesan,
    });
  } else {
    next();
  }
};
