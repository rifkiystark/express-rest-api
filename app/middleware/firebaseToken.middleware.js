const Joi = require("@hapi/joi");
const db = require("../models");

exports.validateToken = async (req, res, next) => {
  const tokenScheme = Joi.object().keys({
    token: Joi.string().required(),
  });
  const result = tokenScheme.validate(req.body, { abortEarly: false });
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
