const Joi = require("@hapi/joi");

exports.validateRegister = (req, res, next) => {
  const registerScheme = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    fullname: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = registerScheme.validate(req.body, { abortEarly: false });
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

exports.validateLogin = (req, res, next) => {
  const loginScheme = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });
  const result = loginScheme.validate(req.body, { abortEarly: false });
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
