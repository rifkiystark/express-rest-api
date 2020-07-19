const Joi = require("@hapi/joi");

exports.validateImage = (req, res, next) => {
  const format = ["jpg", "jpeg", "png"];

  if (!req.files || !req.files.image) {
    res.status(400).send({
      status: "failed",
      message: "No file uploaded",
    });
  } else {
    const image = req.files.image;
    const extension = image.name.split(".")[image.name.split(".").length - 1];
    if (!format.includes(extension)) {
      res.status(415).send({
        status: "failed",
        message: "unsuported format file. Upload png, jpg, or jpeg format",
      });
    } else {
      next();
    }
  }
};

exports.validateUpdate = (req, res, next) => {
  const postScheme = Joi.object().keys({
    caption: Joi.string().allow(""),
    id: Joi.string().required(),
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
