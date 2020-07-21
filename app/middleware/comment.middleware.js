const Joi = require("@hapi/joi");
const db = require("../models/index");
const Post = db.post;

exports.validatePost = async (req, res, next) => {
  const commentScheme = Joi.object().keys({
    post_id: Joi.string().required(),
    comment: Joi.string().required(),
  });
  const result = commentScheme.validate(req.body, { abortEarly: false });
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
        console.log("kok ketemu");
        next();
      } else {
        res.status(400).json({
          message: "Invalid request",
          data: {
            post: "Post data with id not found",
          },
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Invalid request",
        data: {
          post: "Post data with id not found",
        },
      });
    }
  }
};

exports.validateDelete = (req, res, next) => {
  const postScheme = Joi.object().keys({
    comment_id: Joi.string().required(),
  });
  const result = postScheme.validate(req.body, { abortEarly: false });
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
